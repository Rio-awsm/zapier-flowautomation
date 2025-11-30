import { NodeExecutor } from "@/lib/executor-registry/executor-types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";

type HttprequestData = {
  endpoint?: string;
  method?: string;
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

  const result = await step.run("http-request", async () => {
    const endpoint = data.endpoint!;
    const method = data.method || "GET";

    const options: KyOptions = { method };

    if (["POST", "PUT", "PATCH"].includes(method)) {
      options.body = data.body;
    }

    const response = await ky(endpoint, options);
    const contenttype = response.headers.get("content-type");
    const responseData = contenttype?.includes("application/json")
      ? await response.json()
      : await response.text();

    return {
      ...context,
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      },
    };
  });

  return result;
};
