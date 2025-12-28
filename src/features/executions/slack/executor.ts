import { slackChannel } from "@/inngest/channels/slack-execution";
import { NodeExecutor } from "@/lib/executor-registry/executor-types";
import Handlebars from "handlebars";
import { decode } from "html-entities";
import { NonRetriableError } from "inngest";
import ky from "ky";

Handlebars.registerHelper("json", (context) => {
  const stringified = JSON.stringify(context, null, 2);
  const safestring = new Handlebars.SafeString(stringified);

  return safestring;
});

type SlackData = {
  variableName?: string;
  webhookUrl?: string;
  content?: string;
};

export const slackExecutor: NodeExecutor<SlackData> = async ({
  nodeId,
  context,
  step,
  publish,
  data,
}) => {
  await publish(
    slackChannel().status({
      nodeId,
      status: "loading",
    })
  );

  if (!data.content) {
    await publish(
      slackChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("Slack content is missing.");
  }

  const rawContent = Handlebars.compile(data.content)(context);
  const content = decode(rawContent);

  try {
    const result = await step.run("slack-webhook", async () => {
      if (!data.webhookUrl) {
        await publish(
          slackChannel().status({
            nodeId,
            status: "error",
          })
        );
        throw new NonRetriableError("Slack webhook URL is missing.");
      }
      await ky.post(data.webhookUrl!, {
        json: {
          content: content,
        },
      });

      if (!data.variableName) {
        await publish(
          slackChannel().status({
            nodeId,
            status: "error",
          })
        );
        throw new NonRetriableError("Slack node variable name is missing.");
      }

      return {
        ...context,
        [data.variableName]: {
          messageContent: content,
        },
      };
    });

    await publish(
      slackChannel().status({
        nodeId,
        status: "success",
      })
    );

    return result;
  } catch (error) {
    await publish(
      slackChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw error;
  }
};
