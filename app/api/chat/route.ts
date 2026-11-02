import { NextResponse } from "next/server";

// Forwards one message to the Hermes API on the internal Docker network.
// HERMES_API_URL example: http://<hermes-container-name>:8642
// HERMES_API_KEY: the Hermes API key, set as a secret in Coolify.
export async function POST(req: Request) {
  const base = process.env.HERMES_API_URL;
  const key = process.env.HERMES_API_KEY;
  if (!base || !key) {
    return NextResponse.json({ error: "Server is not configured." }, { status: 500 });
  }

  const { message } = (await req.json()) as { message?: string };
  if (!message || !message.trim()) {
    return NextResponse.json({ error: "Empty message." }, { status: 400 });
  }

  const res = await fetch(`${base}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "hermes-agent",
      messages: [{ role: "user", content: message }],
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: `Hermes returned ${res.status}.` }, { status: 502 });
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const raw = data.choices?.[0]?.message?.content ?? "";

  // Remove reasoning text that some models wrap in <think> tags.
  // Hermes replies can also contain reasoning as plain text with no tags,
  // which this does not catch yet. That still needs a fix.
  const reply = raw.replace(/<think>[\s\S]*?<\/think>/g, "").replace(/^[\s\S]*?<\/think>/, "").trim();

  return NextResponse.json({ reply });
}
