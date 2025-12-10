"use server";

import { manualTriggerChannel } from "@/inngest/channels/manual-trigger";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";

export type ManualExecutionToken = Realtime.Token<
  typeof manualTriggerChannel,
  ["status"]
>;

export async function fetchManualtRealtimeToekn(): Promise<ManualExecutionToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: manualTriggerChannel(),
    topics: ["status"],
  });
  return token;
}
