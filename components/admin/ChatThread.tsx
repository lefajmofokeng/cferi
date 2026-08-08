"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Message = {
  id: string;
  sender_id: string;
  content: string | null;
  file_url: string | null;
  file_name: string | null;
  created_at: string;
};

type SenderMap = Record<string, string>;

export default function ChatThread({
  conversationId,
  currentUserId,
}: {
  conversationId: string;
  currentUserId: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [senderNames, setSenderNames] = useState<SenderMap>({});
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    async function loadMessages() {
      const { data: msgs } = await supabase
        .from("chat_messages")
        .select("id, sender_id, content, file_url, file_name, created_at")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (!active) return;
      setMessages(msgs ?? []);

      // Look up display names for everyone who's sent a message here.
      const senderIds = [...new Set((msgs ?? []).map((m) => m.sender_id))];
      if (senderIds.length > 0) {
        const { data: senders } = await supabase
          .from("admin_users")
          .select("id, full_name")
          .in("id", senderIds);

        const map: SenderMap = {};
        (senders ?? []).forEach((s) => {
          map[s.id] = s.full_name;
        });
        if (active) setSenderNames(map);
      }
    }

    loadMessages();

    // Subscribe to new messages in this conversation, live.
    const channel = supabase
      .channel(`chat:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => [...prev, newMsg]);

          // If we don't have this sender's name yet, fetch it.
          setSenderNames((prev) => {
            if (prev[newMsg.sender_id]) return prev;
            supabase
              .from("admin_users")
              .select("full_name")
              .eq("id", newMsg.sender_id)
              .single()
              .then(({ data }) => {
                if (data) {
                  setSenderNames((current) => ({
                    ...current,
                    [newMsg.sender_id]: data.full_name,
                  }));
                }
              });
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);

    const supabase = createClient();
    const { error } = await supabase.from("chat_messages").insert({
      conversation_id: conversationId,
      sender_id: currentUserId,
      content: text.trim(),
    });

    if (!error) setText("");
    setSending(false);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {messages.map((msg) => {
          const isMe = msg.sender_id === currentUserId;
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs rounded px-3 py-2 text-sm ${
                  isMe ? "bg-black text-white" : "bg-gray-100 text-gray-900"
                }`}
              >
                {!isMe && (
                  <p className="text-xs font-medium mb-1 opacity-70">
                    {senderNames[msg.sender_id] ?? "..."}
                  </p>
                )}
                {msg.content && <p className="whitespace-pre-wrap">{msg.content}</p>}
                {msg.file_url && (
                  <a
                    href={msg.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block mt-1 text-xs underline ${
                      isMe ? "text-white" : "text-blue-600"
                    }`}
                  >
                    📎 {msg.file_name ?? "Attached file"}
                  </a>
                )}
                <p className={`text-[10px] mt-1 ${isMe ? "text-gray-300" : "text-gray-400"}`}>
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="border-t border-gray-200 p-4 flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={sending}
          className="bg-black text-white px-4 py-2 rounded text-sm hover:opacity-90 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}