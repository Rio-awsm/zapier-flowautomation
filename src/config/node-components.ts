import { InitialNode } from "@/components/node_components/inital-node";
import { HttpRequestNode } from "@/features/executions/http-request/node";
import { GoogleFormTrigger } from "@/features/triggers/google-form-trigger/node";
import { ManualTriggerNode } from "@/features/triggers/manual-trigger/node";
import { StripeTriggerNode } from "@/features/triggers/stripe-trigger/node";
import { NodeType } from "@/generated/prisma";
import { NodeTypes } from "@xyflow/react";

export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
  [NodeType.HTTP_REQUEST]: HttpRequestNode,
  [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
  [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormTrigger,
  [NodeType.STRIPE_TRIGGER]: StripeTriggerNode
} as const satisfies NodeTypes;

export type RegisteredNodeType = keyof typeof nodeComponents;
