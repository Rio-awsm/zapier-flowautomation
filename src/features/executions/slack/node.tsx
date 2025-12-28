"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { useNodeStatus } from "../hooks/use-node-status";
import { fetchSlackRealtimeToekn } from "./actions";
import { BaseExecutionNode } from "./base-execution-node";
import { FormType, SlackDialog } from "./dialog";

type SlackNodeData = {
  variableName?: string;
  webhookUrl?:string;
  content?: string;
  [key: string]: unknown;
};

type SlackNodeType = Node<SlackNodeData>;

export const SlackNode = memo((props: NodeProps<SlackNodeType>) => {
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
    channel: "slack-execution",
    topic: "status",
    refreshToken: fetchSlackRealtimeToekn,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  return (
    <>
      <SlackDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
         defaultVariableName={nodeData.variableName}
        defaultWebhookUrl={nodeData.webhookUrl}
        defaultContent={nodeData.content}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/logos/slack.svg"
        status={nodeStatus}
        name="slack"
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

SlackNode.displayName = "SlackNode";
