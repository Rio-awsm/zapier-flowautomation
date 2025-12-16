"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { useNodeStatus } from "../hooks/use-node-status";
import { fetchOpenAIRealtimeToekn } from "./actions";
import { BaseExecutionNode } from "./base-execution-node";
import { FormType, OpenAiDialog } from "./dialog";

type OpenAINodeData = {
  variableName?: string;
  model?: string;
  systemPrompt?: string;
  userPrompt?: string;
  [key: string]: unknown;
};

type OpenAINodeType = Node<OpenAINodeData>;

export const OpenAiNode = memo((props: NodeProps<OpenAINodeType>) => {
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
    channel: "openai-execution",
    topic: "status",
    refreshToken: fetchOpenAIRealtimeToekn,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  return (
    <>
      <OpenAiDialog
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
        icon="/logos/openai.svg"
        status={nodeStatus}
        name="OpenAI"
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

OpenAiNode.displayName = "OpenAiNode";
