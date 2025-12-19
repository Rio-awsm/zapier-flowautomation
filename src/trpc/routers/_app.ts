import { credentialsRouter } from "@/features/credentials/routers";
import { workflowRouter } from "@/features/workflows/server/routers";
import { createTRPCRouter } from "../init";
export const appRouter = createTRPCRouter({
  workflows: workflowRouter,
  credentials: credentialsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
