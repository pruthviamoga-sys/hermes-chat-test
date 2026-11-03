import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { task, agent = "hermes" } = await req.json();

  // Local test agent: no network call, so it works without Hermes.
  if (agent === "echo") {
    return NextResponse.json({ answer: `Echo: ${task}` });
  }

  const base = process.env.HERMES_API_URL;
  const key = process.env.HERMES_API_KEY;
  if (!base || !key) {
    return NextResponse.json(
      { error: "Missing HERMES_API_URL or HERMES_API_KEY in .env.local" },
      { status: 500 },
    );
  }

  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "hermes-agent",
        messages: [{ role: "user", content: task }],
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: `Hermes returned ${res.status}` }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json({ answer: data.choices?.[0]?.message?.content ?? "" });
  } catch (err) {
    return NextResponse.json(
      { error: `Could not reach Hermes: ${err instanceof Error ? err.message : String(err)}` },
      { status: 502 },
    );
  }
}