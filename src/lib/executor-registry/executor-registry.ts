import { httprequestExecutor } from "@/features/executions/http-request/executor";
import { manualTriggerExecutor } from "@/features/triggers/manual-trigger/executor";
import { NodeType } from "@/generated/prisma";
import { NodeExecutor } from "./executor-types";

export const executorRegistry: Record<NodeType, NodeExecutor> = {
  [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
  [NodeType.INITIAL]: manualTriggerExecutor,
  [NodeType.HTTP_REQUEST]: httprequestExecutor,
};

export const getExecutor = (type: NodeType): NodeExecutor => {
  const executor = executorRegistry[type];
  if (!executor) {
    throw new Error(`No executor found for ${type}`);
  }

  return executor;
};
