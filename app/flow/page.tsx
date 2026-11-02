"use client";

import { useState } from "react";
import flow from "@/flows/greeting.json";

type Option = { label: string; next: string; action?: string };
type Step = { type: "question" | "message"; text: string; options?: Option[]; next?: string | null };

const steps = flow.steps as Record<string, Step>;

// Fixed, non-AI actions the flow can call
const actions: Record<string, () => string> = {
  show_time: () => `The time is ${new Date().toLocaleTimeString()}`,
};

export default function FlowPage() {
  const [current, setCurrent] = useState(flow.start);
  const [log, setLog] = useState<string[]>([]);
  const step = steps[current];

  function choose(option: Option) {
    const entry = option.action && actions[option.action] ? actions[option.action]() : option.label;
    setLog((l) => [...l, entry]);
    setCurrent(option.next);
  }

  return (
    <main style={{ maxWidth: 720, margin: "40px auto", padding: "0 16px", fontFamily: "sans-serif" }}>
      <h1>Flow test: {flow.id}</h1>

      <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16, marginBottom: 16 }}>
        <p>{step.text}</p>
        {step.type === "question" && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {step.options?.map((o) => (
              <button key={o.label} onClick={() => choose(o)}>
                {o.label}
              </button>
            ))}
          </div>
        )}
        {step.type === "message" && (
          <button onClick={() => setCurrent(step.next ?? flow.start)}>Continue</button>
        )}
      </div>

      <div style={{ color: "#555" }}>
        {log.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
    </main>
  );
}