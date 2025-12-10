import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { NodeProps } from "@xyflow/react";
import { MousePointerIcon } from "lucide-react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { fetchManualtRealtimeToekn } from "./actions";
import { ManualTriggerDialog } from "./dialog";

export const ManualTriggerNode = memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: "manual-trigger",
    topic: "status",
    refreshToken: fetchManualtRealtimeToekn,
  });
  const handleOpenSettings = () => setDialogOpen(true);
  return (
    <>
      <ManualTriggerDialog open={dialogOpen} onopenChange={setDialogOpen} />
      <BaseTriggerNode
        {...props}
        icon={MousePointerIcon}
        name="When clicking 'Execute workflow"
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});
