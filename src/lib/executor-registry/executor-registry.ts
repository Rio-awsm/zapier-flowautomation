import { anthropicExecutor } from "@/features/executions/anthropic/executor";
import { discordExecutor } from "@/features/executions/discord/executor";
import { geminiExecutor } from "@/features/executions/gemini/executor";
import { httprequestExecutor } from "@/features/executions/http-request/executor";
import { openaiExecutor } from "@/features/executions/openai/executor";
import { googleFormTriggerExecutor } from "@/features/triggers/google-form-trigger/executor";
import { manualTriggerExecutor } from "@/features/triggers/manual-trigger/executor";
import { stripeTriggerExecutor } from "@/features/triggers/stripe-trigger/executor";
import { NodeType } from "@/generated/prisma";
import { NodeExecutor } from "./executor-types";

export const executorRegistry: Record<NodeType, NodeExecutor> = {
  [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
  [NodeType.INITIAL]: manualTriggerExecutor,
  [NodeType.HTTP_REQUEST]: httprequestExecutor,
  [NodeType.GOOGLE_FORM_TRIGGER]: googleFormTriggerExecutor,
  [NodeType.STRIPE_TRIGGER]: stripeTriggerExecutor,
  [NodeType.GEMINI]: geminiExecutor,
  [NodeType.OPENAI]: openaiExecutor,
  [NodeType.ANTRHOPIC]: anthropicExecutor,
  [NodeType.DISCORD]: discordExecutor
};

export const getExecutor = (type: NodeType): NodeExecutor => {
  const executor = executorRegistry[type];
  if (!executor) {
    throw new Error(`No executor found for ${type}`);
  }

  return executor;
};
