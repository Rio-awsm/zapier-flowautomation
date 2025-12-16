"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { useNodeStatus } from "../hooks/use-node-status";
import { fetchGeminiRealtimeToekn } from "./actions";
import { BaseExecutionNode } from "./base-execution-node";
import { FormType, GeminiDialog } from "./dialog";

type GeminiNodeData = {
  variableName?: string;
  model?: string;
  systemPrompt?: string;
  userPrompt?: string;
  [key: string]: unknown;
};

type GeminiNodeType = Node<GeminiNodeData>;

export const GeminiNode = memo((props: NodeProps<GeminiNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { setNodes } = useReactFlow();

  const handleSubmit = (values: FormType) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              variableName: values.variableName,
              model: values.model,
              systemPrompt: values.systemPrompt,
              userPrompt: values.userPrompt,
            },
          };
        }
        return node;
      })
    );
  };

  const nodeData = props.data;
  const description = nodeData?.userPrompt
    ? `${nodeData.model}`
    : "Not Configured";

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: "gemini-execution",
    topic: "status",
    refreshToken: fetchGeminiRealtimeToekn,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  return (
    <>
      <GeminiDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultModel={nodeData.model}
        defaultVariableName={nodeData.variableName}
        defaultSystemPrompt={nodeData.systemPrompt}
        defaultUserPrompt={nodeData.userPrompt}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/logos/gemini.svg"
        status={nodeStatus}
        name="Gemini"
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

GeminiNode.displayName = "GeminiNode";
