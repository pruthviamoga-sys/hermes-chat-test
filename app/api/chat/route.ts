import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";

export const maxDuration = 120;

export async function POST(req: Request) {
  const base = process.env.HERMES_API_URL;
  const key = process.env.HERMES_API_KEY;
  if (!base || !key) {
    return new Response("Missing HERMES_API_URL or HERMES_API_KEY", { status: 500 });
  }

  const { messages }: { messages: UIMessage[] } = await req.json();

  const hermes = createOpenAICompatible({
    name: "hermes",
    baseURL: `${base.replace(/\/$/, "")}/v1`,
    apiKey: key,
  });

  const result = streamText({
    model: hermes("hermes-agent"),
    messages: await convertToModelMessages(messages),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}