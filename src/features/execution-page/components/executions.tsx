"use client";
import {
  EntityContainer,
  EntityItem,
  EntityList,
  EntityPagination,
} from "@/components/shared/entity-views/entity-container";
import { EntityHeader } from "@/components/shared/entity-views/entity-header";
import {
  EmptyView,
  ErrorView,
  LoadingView,
} from "@/components/shared/entity-views/entity-util-components";
import { Execution, ExecutionStatus } from "@/generated/prisma";
import { formatDistanceToNow } from "date-fns";
import {
  CheckCircle2Icon,
  Clock10Icon,
  Loader2Icon,
  XCircleIcon,
} from "lucide-react";
import { useSuspenseExecutions } from "../hooks/use-executions";
import { useExecutionsParams } from "../hooks/use-executions-params";

export const ExecutionsList = () => {
  const executions = useSuspenseExecutions();
  return (
    <EntityList
      items={executions.data.items}
      getKey={(execution) => execution.id}
      renderItem={(execution) => <ExecutionItem data={execution} />}
      emptyView={<ExecutionsEmpty />}
    />
  );
};

export const ExecutionsHeader = () => {
  return (
    <>
      <EntityHeader
        title="Executions"
        description="View your workflow execution history"
      />
    </>
  );
};

export const ExecutionsPagination = () => {
  const executions = useSuspenseExecutions();
  const [params, setParams] = useExecutionsParams();

  return (
    <EntityPagination
      disabled={executions.isFetching}
      totalPages={executions.data.totalPages}
      page={executions.data.page}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

export const ExecutionsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<ExecutionsHeader />}
      pagination={<ExecutionsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const ExecutionsLoading = () => {
  return <LoadingView entity="executions" message="Loading executions...." />;
};

export const ExecutionsError = () => {
  return <ErrorView entity="executions" message="Error Loading executions!" />;
};

export const ExecutionsEmpty = () => {
  return (
    <>
      <EmptyView message="You have no workflow executions yet." />
    </>
  );
};

export const getStatusIcon = (status: ExecutionStatus) => {
  switch (status) {
    case ExecutionStatus.SUCCESS:
      return <CheckCircle2Icon className="size-5 text-green-600" />;
    case ExecutionStatus.FAILED:
      return <XCircleIcon className="size-5 text-red-600" />;
    case ExecutionStatus.RUNNING:
      return <Loader2Icon className="size-5 text-blue-600 animate-spin" />;
    default:
      return <Clock10Icon className="size-5 text-muted-foreground" />;
  }
};

export const ExecutionItem = ({
  data,
}: {
  data: Execution & {
    workflow: {
      id: string;
      name: string;
    };
  };
}) => {
  const duration = data.completedAt
    ? Math.round(
        (new Date(data.completedAt).getTime() -
          new Date(data.startedAt).getTime()) /
          1000
      )
    : null;

  const subTitle = (
    <>
      {data.workflow.name} &bull; Started{" "}
      {formatDistanceToNow(data.startedAt, { addSuffix: true })}{" "}
      {duration !== null && <> &bull; Took {duration}s</>}{" "}
    </>
  );

  return (
    <EntityItem
      href={`/executions/${data.id}`}
      title={data.status}
      subtitle={subTitle}
      image={
        <div className="size-8 flex items-center justify-center">
          {getStatusIcon(data.status)}
        </div>
      }
    />
  );
};
