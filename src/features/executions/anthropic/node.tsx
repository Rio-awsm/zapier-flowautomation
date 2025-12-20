"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { useNodeStatus } from "../hooks/use-node-status";
import { fetchAntrhopicRealtimeToekn } from "./actions";
import { BaseExecutionNode } from "./base-execution-node";
import { AntrhopicDialog, FormType } from "./dialog";

type AnthropicNodeData = {
  variableName?: string;
  model?: string;
  systemPrompt?: string;
  userPrompt?: string;
   credentialId?:string;
  [key: string]: unknown;
};

type AnthropicNodeType = Node<AnthropicNodeData>;

export const AnthropicNode = memo((props: NodeProps<AnthropicNodeType>) => {
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
              credentialId: values.credentialId
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
    channel: "anthropic-execution",
    topic: "status",
    refreshToken: fetchAntrhopicRealtimeToekn,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  return (
    <>
      <AntrhopicDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultModel={nodeData.model}
        defaultVariableName={nodeData.variableName}
        defaultSystemPrompt={nodeData.systemPrompt}
        defaultUserPrompt={nodeData.userPrompt}
        defaultCredentialId={nodeData.credentialId}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/logos/anthropic.svg"
        status={nodeStatus}
        name="Anthropic"
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

AnthropicNode.displayName = "AnthropicNode";
