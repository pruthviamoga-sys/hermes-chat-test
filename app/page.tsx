"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";

export default function Page() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });
  const [input, setInput] = useState("");
  const started = useRef(false);

  // Welcome: ask Hermes for a greeting once, on first load
  useEffect(() => {
    if (!started.current && messages.length === 0) {
      started.current = true;
      sendMessage({ text: "Hi" });
    }
  }, [messages.length, sendMessage]);

  const busy = status === "submitted" || status === "streaming";

  return (
    <main style={{ maxWidth: 720, margin: "40px auto", padding: "0 16px", fontFamily: "sans-serif" }}>
      <h1>Hermes chat test</h1>

      <div style={{ display: "grid", gap: 12, marginBottom: 16 }}>
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              background: m.role === "user" ? "#e8f0fe" : "#fff",
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 12,
              whiteSpace: "pre-wrap",
            }}
          >
            <strong>{m.role === "user" ? "You" : "Hermes"}:</strong>{" "}
            {m.parts.map((p, i) => (p.type === "text" ? <span key={i}>{p.text}</span> : null))}
          </div>
        ))}
        {busy && <div>Hermes is working...</div>}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const text = input.trim();
          if (!text || busy) return;
          sendMessage({ text });
          setInput("");
        }}
        style={{ display: "flex", gap: 8 }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Hermes..."
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit" disabled={busy}>Send</button>
      </form>
    </main>
  );
}