"use client";

import { AddNodeButton } from "@/components/node_components/add-node-button";
import {
  ErrorView,
  LoadingView,
} from "@/components/shared/entity-views/entity-util-components";
import { nodeComponents } from "@/config/node-components";
import { NodeType } from "@/generated/prisma";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  Edge,
  EdgeChange,
  MiniMap,
  Node,
  NodeChange,
  Panel,
  ReactFlow,
  type Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useSetAtom } from "jotai";
import { useCallback, useMemo, useState } from "react";
import { useSuspenseWorkflow } from "../workflows/hooks/use-workflows";
import { ExecuteWorkflowButton } from "./execute-workflow-button";
import { editorAtom } from "./store/atoms";

export const EditorLoading = () => {
  return <LoadingView message="Loading Editor..." />;
};

export const EditorError = () => {
  return <ErrorView message="Error Loading the Editor!" />;
};

export const Editor = ({ workflowId }: { workflowId: string }) => {
  const setEditor = useSetAtom(editorAtom);

  const { data: workflow } = useSuspenseWorkflow(workflowId);
  const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
  const [edges, setEdges] = useState<Edge[]>(workflow.edges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  const hasManualTrigger = useMemo(() => {
    return nodes.some((node) => node.type === NodeType.MANUAL_TRIGGER);
  }, [nodes]);

  return (
    <div className="size-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setEditor}
        fitView
        nodeTypes={nodeComponents}
        snapGrid={[10, 10]}
        snapToGrid
        panOnScroll
        panOnDrag={false}
        selectionOnDrag
      >
        <Background />
        <Controls />
        <MiniMap />
        <Panel position="top-right">
          <AddNodeButton />
        </Panel>

        {hasManualTrigger && (
          <Panel position="bottom-center">
            <ExecuteWorkflowButton workflowId={workflowId} />
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
};
