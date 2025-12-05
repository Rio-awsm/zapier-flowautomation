import { NodeExecutor } from "@/lib/executor-registry/executor-types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";

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
  data,
}) => {
  if (!data.endpoint) {
    throw new NonRetriableError("HTTP Request no endpoint configured");
  }

  if (!data.variableName) {
    throw new NonRetriableError("HTTP Request no Variable Name is given");
  }

  if (!data.method) {
    throw new NonRetriableError("HTTP Request no method given");
  }

  const result = await step.run("http-request", async () => {
    const endpoint = data.endpoint;
    const method = data.method || "GET";

    const options: KyOptions = { method };

    if (["POST", "PUT", "PATCH"].includes(method)) {
      options.body = data.body;
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

  return result;
};
