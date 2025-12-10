import { httpRequestChannel } from "@/inngest/channels/http-request";
import { NodeExecutor } from "@/lib/executor-registry/executor-types";
import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";

Handlebars.registerHelper("json", (context) => {
  const stringified = JSON.stringify(context, null, 2);
  const safestring = new Handlebars.SafeString(stringified);

  return safestring;
});

type HttprequestData = {
  variableName: string;
  endpoint: string;
  method: string;
  body?: string;
};

export const httprequestExecutor: NodeExecutor<HttprequestData> = async ({
  nodeId,
  context,
  step,
  publish,
  data,
}) => {
  await publish(
    httpRequestChannel().status({
      nodeId,
      status: "loading",
    })
  );

  if (!data.endpoint) {
    await publish(
      httpRequestChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("HTTP Request no endpoint configured");
  }

  if (!data.variableName) {
    await publish(
      httpRequestChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("HTTP Request no Variable Name is given");
  }

  if (!data.method) {
    await publish(
      httpRequestChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("HTTP Request no method given");
  }

  try {
    const result = await step.run("http-request", async () => {
      const endpoint = Handlebars.compile(data.endpoint)(context);
      const method = data.method || "GET";

      const options: KyOptions = { method };

      if (["POST", "PUT", "PATCH"].includes(method)) {
        const resolved = Handlebars.compile(data.body || "{}")(context);
        JSON.parse(resolved);
        options.body = resolved;
        options.headers = {
          "Content-Type": "application/json",
        };
      }

      const response = await ky(endpoint, options);
      const contenttype = response.headers.get("content-type");
      const responseData = contenttype?.includes("application/json")
        ? await response.json()
        : await response.text();

      const responsePayload = {
        httpResponse: {
          status: response.status,
          statusText: response.statusText,
          data: responseData,
        },
      };

      return {
        ...context,
        [data.variableName]: responsePayload,
      };
    });

    await publish(
      httpRequestChannel().status({
        nodeId,
        status: "success",
      })
    );

    return result;
  } catch (error) {
    await publish(
      httpRequestChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw error;
  }
};
