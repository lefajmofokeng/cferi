"use client";

import { useEffect, useRef, useState } from "react";
import "./Chatbot.css";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const SUGGESTED_QUESTIONS = [
  "What programs do you offer?",
  "How do I apply for incubation?",
  "Upcoming events & workshops",
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  async function sendMessage(messageText: string) {
    const trimmed = messageText.trim();
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

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  function handleClearChat() {
    setMessages([]);
  }

  const hasUserMessaged = messages.some((m) => m.role === "user");

  return (
    <div className="chatbot-widget">
      {isOpen && (
        <div className="chatbot-panel">
          <div className="chatbot-panel__header">
            <span className="chatbot-panel__title">Maluti Assistant</span>
            <div className="chatbot-panel__header-actions">
              {hasUserMessaged && (
                <button
                  onClick={handleClearChat}
                  className="chatbot-panel__action-btn"
                  aria-label="Clear chat"
                  title="Clear conversation"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="chatbot-panel__action-btn"
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="chatbot-panel__messages">
            {!hasUserMessaged ? (
              <div className="chatbot-welcome-container">
                <h1 className="chatbot-welcome-text">
                  Hello there, <br />
                  how can I help you?
                </h1>
                <div className="chatbot-suggestions">
                  {SUGGESTED_QUESTIONS.map((question, i) => (
                    <button
                      key={i}
                      className="chatbot-suggestion-chip"
                      onClick={() => sendMessage(question)}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`chatbot-message ${
                      msg.role === "user"
                        ? "chatbot-message--user"
                        : "chatbot-message--assistant"
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
              </>
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
        className={`chatbot-bubble ${isOpen ? "chatbot-bubble--open" : ""}`}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          "✕"
        ) : (
          <svg
            className="chatbot-icon"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
            <rect x="4" y="8" width="16" height="12" rx="4" />
            <circle cx="9" cy="13" r="1" fill="currentColor" />
            <circle cx="15" cy="13" r="1" fill="currentColor" />
            <path d="M10 17h4" />
          </svg>
        )}
      </button>
    </div>
  );
}