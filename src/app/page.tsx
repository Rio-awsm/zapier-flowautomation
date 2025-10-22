"use client";

import Logout from "@/components/logout";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const Page = () => {
  // await requireAuth()
  // const data = await caller.getUsers()
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data } = useQuery(trpc.getWorkflows.queryOptions());
  const create = useMutation(
    trpc.createWorkflow.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.getWorkflows.queryOptions());
      },
    })
  );

  const testAi = useMutation(trpc.testAi.mutationOptions({
    onSuccess: () => {
      toast.success("AI Job Queued")
    }
  }));
  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center gap-y-6">
      protected homepage
      <div>{JSON.stringify(data, null, 2)}</div>
      <Button onClick={() => create.mutate()}>Create Workflow</Button>
      <div>
        <Logout />
      </div>
      <Button disabled={testAi.isPending} onClick={() => testAi.mutate()}>
        Test AI
      </Button>
    </div>
  );
};

export default Page;
