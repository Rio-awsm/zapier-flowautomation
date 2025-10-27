"use client";
import { EntityContainer } from "@/components/shared/entity-views/entity-container";
import { EntityHeader } from "@/components/shared/entity-views/entity-header";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import {
  useCreateWorkflows,
  useSuspenseWorkflows,
} from "../hooks/use-workflows";

const WorkflowsList = () => {
  const workflows = useSuspenseWorkflows();
  return (
    <div className="flex-1 justify-center items-center flex">
      {JSON.stringify(workflows.data, null, 2)}
    </div>
  );
};

export default WorkflowsList;

export const WorkflowsHeader = ({ disabled }: { disabled?: boolean }) => {
  const createWorkflow = useCreateWorkflows();
  const { handleError, model } = useUpgradeModal();

  const handleCreate = () => {
    createWorkflow.mutate(undefined, {
      onError: (error) => {
        handleError(error);
      },
    });
  };
  return (
    <>
      {model}
      <EntityHeader
        title="Workflows"
        description="Create and manage your Workflows"
        onNew={handleCreate}
        newButtonLabel="New Workflow"
        disabled={disabled}
        isCreating={createWorkflow.isPending}
      />
    </>
  );
};

export const WorkflowsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<WorkflowsHeader />}
      search={<></>}
      pagination={<></>}
    >
      {children}
    </EntityContainer>
  );
};
