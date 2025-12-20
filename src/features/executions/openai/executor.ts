import { openAIChannel } from "@/inngest/channels/openai-execution";
import prisma from "@/lib/db";
import { NodeExecutor } from "@/lib/executor-registry/executor-types";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";

Handlebars.registerHelper("json", (context) => {
  const stringified = JSON.stringify(context, null, 2);
  const safestring = new Handlebars.SafeString(stringified);

  return safestring;
});

type OpenAiData = {
  variableName?: string;
  model?: string;
  systemPrompt?: string;
  userPrompt?: string;
  credentialId?: string;
};

export const openaiExecutor: NodeExecutor<OpenAiData> = async ({
  nodeId,
  context,
  step,
  publish,
  data,
}) => {
  await publish(
    openAIChannel().status({
      nodeId,
      status: "loading",
    })
  );

  if (!data.variableName) {
    await publish(
      openAIChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("OpenAI node variable name is missing.");
  }

  if (!data.userPrompt) {
    await publish(
      openAIChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("OpenAI userprompt is missing.");
  }

  if (!data.credentialId) {
    await publish(
      openAIChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("OpenAI API key is missing.");
  }

  const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : "You are a helpful assistant.";

  const userPrompt = Handlebars.compile(data.userPrompt)(context);

  const credential = await step.run("get-credential", () => {
    return prisma.credential.findUnique({
      where: {
        id: data.credentialId,
      },
    });
  });

  if (!credential) {
    throw new NonRetriableError("OpenAI node: Credential not found.");
  }

  const openAI = createOpenAI({
    apiKey: credential.value,
  });

  try {
    const { steps } = await step.ai.wrap(
      "openAI-generative-text",
      generateText,
      {
        model: openAI(data.model || "gpt-5-mini"),
        system: systemPrompt,
        prompt: userPrompt,
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      }
    );
    const text =
      steps[0].content[0].type === "text" ? steps[0].content[0].text : "";

    await publish(
      openAIChannel().status({
        nodeId,
        status: "success",
      })
    );

    return {
      ...context,
      [data.variableName]: {
        text,
      },
    };
  } catch (error) {
    await publish(
      openAIChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw error;
  }
};
