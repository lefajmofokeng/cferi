"use client";

import { useEffect, useRef, useState } from "react";
import "./Chatbot.css";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm here to help with questions about the Maluti Incubation Center — programs, applying, events, and more. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const newMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply ?? "Sorry, something went wrong." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I'm having trouble connecting right now." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chatbot-widget">
      {isOpen && (
        <div className="chatbot-panel">
          <div className="chatbot-panel__header">
            <span>Maluti Assistant</span>
            <button
              onClick={() => setIsOpen(false)}
              className="chatbot-panel__close"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          <div className="chatbot-panel__messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chatbot-message ${
                  msg.role === "user" ? "chatbot-message--user" : "chatbot-message--assistant"
                }`}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="chatbot-message chatbot-message--assistant chatbot-message--typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="chatbot-panel__form">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="chatbot-panel__input"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="chatbot-panel__send"
              aria-label="Send message"
            >
              ➤
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="chatbot-bubble"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? "✕" : "💬"}
      </button>
    </div>
  );
}