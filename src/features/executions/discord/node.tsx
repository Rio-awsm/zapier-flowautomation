"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { useNodeStatus } from "../hooks/use-node-status";
import { fetchDiscordRealtimeToekn } from "./actions";
import { BaseExecutionNode } from "./base-execution-node";
import { DiscordDialog, FormType } from "./dialog";

type DiscordNodeData = {
  variableName?: string;
  webhookUrl?:string;
  content?: string;
  username?: string;
  [key: string]: unknown;
};

type DiscordNodeType = Node<DiscordNodeData>;

export const DiscordNode = memo((props: NodeProps<DiscordNodeType>) => {
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
              webhookUrl: values.webhookUrl,
              content: values.content,
              username: values.username,
            },
          };
        }
        return node;
      })
    );
  };

  const nodeData = props.data;
  const description = nodeData?.content
    ? `send ${nodeData.content.slice(0,50)}....`
    : "Not Configured";

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: "discord-execution",
    topic: "status",
    refreshToken: fetchDiscordRealtimeToekn,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  return (
    <>
      <DiscordDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
         defaultVariableName={nodeData.variableName}
        defaultWebhookUrl={nodeData.webhookUrl}
        defaultContent={nodeData.content}
        defaultUsername={nodeData.username}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/logos/discord.svg"
        status={nodeStatus}
        name="Discord"
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

DiscordNode.displayName = "DiscordNode";
