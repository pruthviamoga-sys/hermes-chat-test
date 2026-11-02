"use client";

import { useState } from "react";
import flow from "@/flows/greeting.json";

type Option = { label: string; next: string };
type Step = { type: "question" | "message"; text: string; options?: Option[]; next?: string | null };

const steps = flow.steps as Record<string, Step>;

export default function FlowPage() {
  const [current, setCurrent] = useState(flow.start);
  const step = steps[current];
  const [log, setLog] = useState<string[]>([]);

  function go(next: string | null | undefined, label?: string) {
    if (label) setLog((l) => [...l, label]);
    if (next) setCurrent(next);
  }

  return (
    <main style={{ maxWidth: 720, margin: "40px auto", padding: "0 16px", fontFamily: "sans-serif" }}>
      <h1>Flow test: {flow.id}</h1>

      <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16, marginBottom: 16 }}>
        <p>{step.text}</p>
        {step.type === "question" && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {step.options?.map((o) => (
              <button key={o.label} onClick={() => go(o.next, o.label)}>
                {o.label}
              </button>
            ))}
          </div>
        )}
        {step.type === "message" && (
          <button onClick={() => go(step.next)}>Continue</button>
        )}
      </div>

      <div style={{ color: "#555" }}>
        {log.map((l, i) => (
          <div key={i}>Chose: {l}</div>
        ))}
      </div>
    </main>
  );
}