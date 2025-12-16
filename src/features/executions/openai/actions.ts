"use server";

import { openAIChannel } from "@/inngest/channels/openai-execution";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";

export type OpeanAIToken = Realtime.Token<
  typeof openAIChannel,
  ["status"]
>;

export async function fetchOpenAIRealtimeToekn(): Promise<OpeanAIToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: openAIChannel(),
    topics: ["status"],
  });
  return token;
}
