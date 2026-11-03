"use client";

import { useState } from "react";
import flow from "@/flows/agent-pick.json";

type Option = { label: string; next: string };
type Step = {
  type: "message" | "question" | "agent" | "result";
  text?: string;
  options?: Option[];
  next?: string;
  agent?: string;
  task?: string;
  from?: string;
};

const steps = flow.steps as Record<string, Step>;

function prompt(s: Step): string {
  if (s.type === "agent") return `Ready to run ${s.agent}. Click Run agent.`;
  if (s.type === "result") return "Here is the result:";
  return s.text ?? "";
}

function ResultCard({ title, body }: { title: string; body: string }) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: 8,
        padding: 12,
        background: "#fff",
        whiteSpace: "pre-wrap",
        marginBottom: 8,
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: 8 }}>{title}</div>
      {body || "No answer."}
    </div>
  );
}

export default function AgentFlowPage() {
  const [current, setCurrent] = useState(flow.start);
  const [history, setHistory] = useState<{ from: "bot" | "user"; text: string }[]>([]);
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const step = steps[current];

  function describe(s: Step): string {
    if (s.type === "result") return answer || "No answer yet.";
    return prompt(s);
  }

  function advance(next: string, userLabel?: string) {
    setHistory((h) => [
      ...h,
      { from: "bot", text: describe(step) },
      ...(userLabel ? [{ from: "user" as const, text: userLabel }] : []),
    ]);
    setCurrent(next);
  }

  async function runAgent(s: Step) {
    setBusy(true);
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent: s.agent, task: s.task }),
      });
      const data = await res.json();
      setAnswer(res.ok ? data.answer : `Error: ${data.error}`);
      advance(s.next!);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ maxWidth: 600, margin: "0 auto", padding: 16, fontFamily: "sans-serif" }}>
      {history.map((m, i) => (
        <p key={i} style={{ textAlign: m.from === "user" ? "right" : "left" }}>
          <b>{m.from === "user" ? "You" : "Bot"}:</b> {m.text}
        </p>
      ))}
      <div>
        <p>
          <b>Bot:</b> {prompt(step)}
        </p>
        {step.type === "question" ? (
          step.options!.map((o) => (
            <button key={o.label} onClick={() => advance(o.next, o.label)} style={{ marginRight: 8 }}>
              {o.label}
            </button>
          ))
        ) : step.type === "agent" ? (
          <button disabled={busy} onClick={() => runAgent(step)}>
            {busy ? "Running..." : "Run agent"}
          </button>
        ) : step.type === "result" ? (
          <>
            <ResultCard title={`Result from ${step.from}`} body={answer} />
            <button onClick={() => advance(step.next!)}>Continue</button>
          </>
        ) : (
          <button onClick={() => advance(step.next!)}>Continue</button>
        )}
      </div>
    </main>
  );
}