"use client";

import { useEffect, useState } from "react";

type Msg = { role: "user" | "assistant"; text: string };

async function askHermes(message: string): Promise<string> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  const data = (await res.json()) as { reply?: string; error?: string };
  if (!res.ok || !data.reply) {
    return `Error: ${data.error ?? "no reply"}`;
  }
  return data.reply;
}

export default function Page() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  // Welcome message from Hermes when the page opens.
  useEffect(() => {
    setBusy(true);
    askHermes("Send a short welcome message to the user.").then((text) => {
      setMessages([{ role: "assistant", text }]);
      setBusy(false);
    });
  }, []);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text }]);
    setBusy(true);
    const reply = await askHermes(text);
    setMessages((m) => [...m, { role: "assistant", text: reply }]);
    setBusy(false);
  }

  return (
    <main style={{ maxWidth: 680, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 20 }}>Hermes chat test</h1>
      <div style={{ minHeight: 300, display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              background: m.role === "user" ? "#111" : "#fff",
              color: m.role === "user" ? "#fff" : "#111",
              border: m.role === "user" ? "none" : "1px solid #ddd",
              borderRadius: 10,
              padding: "8px 12px",
              maxWidth: "80%",
              whiteSpace: "pre-wrap",
            }}
          >
            {m.text}
          </div>
        ))}
        {busy && <div style={{ color: "#777" }}>Hermes is working...</div>}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        style={{ display: "flex", gap: 8, marginTop: 16 }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Hermes..."
          style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
        />
        <button
          type="submit"
          disabled={busy}
          style={{ padding: "10px 16px", borderRadius: 8, border: "none", background: "#111", color: "#fff" }}
        >
          Send
        </button>
      </form>
    </main>
  );
}
