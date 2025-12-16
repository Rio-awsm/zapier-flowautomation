"use server";

import { geminiChannel } from "@/inngest/channels/gemini-execution";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";

export type GeminiToken = Realtime.Token<
  typeof geminiChannel,
  ["status"]
>;

export async function fetchGeminiRealtimeToekn(): Promise<GeminiToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: geminiChannel(),
    topics: ["status"],
  });
  return token;
}
