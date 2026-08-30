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

function isImageFile(fileName: string | null): boolean {
  if (!fileName) return false;
  return /\.(png|jpe?g|gif|webp|svg)$/i.test(fileName);
}

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
  const [file, setFile] = useState<File | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

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

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        stream.getTracks().forEach((track) => track.stop());
        await sendVoiceNote(audioBlob);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch {
      alert("Microphone access is required to record a voice note.");
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  }

  async function sendVoiceNote(audioBlob: Blob) {
    setSending(true);
    const supabase = createClient();
    const filePath = `${Date.now()}-voice-note.webm`;

    const { error: uploadError } = await supabase.storage
      .from("chat-files")
      .upload(filePath, audioBlob);

    if (uploadError) {
      setSending(false);
      return;
    }

    const { data: signedData } = await supabase.storage
      .from("chat-files")
      .createSignedUrl(filePath, 60 * 60 * 24 * 7);

    await supabase.from("chat_messages").insert({
      conversation_id: conversationId,
      sender_id: currentUserId,
      content: null,
      file_url: signedData?.signedUrl ?? null,
      file_name: "voice-note.webm",
    });

    setSending(false);
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() && !file) return;
    setSending(true);

    const supabase = createClient();
    let fileUrl: string | null = null;
    let fileName: string | null = null;

    if (file) {
      const filePath = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("chat-files")
        .upload(filePath, file);

      if (uploadError) {
        setSending(false);
        return;
      }

      const { data: signedData } = await supabase.storage
        .from("chat-files")
        .createSignedUrl(filePath, 60 * 60 * 24 * 7);

      fileUrl = signedData?.signedUrl ?? null;
      fileName = file.name;
    }

    const { error } = await supabase.from("chat_messages").insert({
      conversation_id: conversationId,
      sender_id: currentUserId,
      content: text.trim() || null,
      file_url: fileUrl,
      file_name: fileName,
    });

    if (!error) {
      setText("");
      setFile(null);
    }
    setSending(false);
  }

  return (
    <div className="flex flex-col h-full bg-[#FFFFFF]">
      {/* Scrollbar styling */}
      <style jsx global>{`
        .chat-thread-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .chat-thread-scrollbar::-webkit-scrollbar-button {
          display: none;
          width: 0;
          height: 0;
        }
        .chat-thread-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .chat-thread-scrollbar::-webkit-scrollbar-thumb {
          background-color: #dadce0;
          border-radius: 4px;
        }
        .chat-thread-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #bdc1c6;
        }
        .chat-thread-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #dadce0 transparent;
        }
      `}</style>

      {/* Message Feed Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 chat-thread-scrollbar bg-[#F8F9FA]/30">
        {messages.map((msg) => {
          const isMe = msg.sender_id === currentUserId;
          const normalizedFileName = (msg.file_name ?? "").toLowerCase();
          const isVoiceNote = !!msg.file_url && normalizedFileName.includes("voice-note");
          const isImageAttachment = !!msg.file_url && isImageFile(msg.file_name);
          const senderName = senderNames[msg.sender_id] ?? "Team Member";

          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"} items-end gap-2`}>
              {!isMe && (
                <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-700 text-xs font-semibold flex items-center justify-center shrink-0 mb-1">
                  {senderName.charAt(0).toUpperCase()}
                </div>
              )}

              <div
                className={`max-w-md rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-xs ${
                  isMe
                    ? "bg-[#1A73E8] text-white rounded-br-xs"
                    : "bg-[#F1F3F4] text-gray-800 rounded-bl-xs border border-gray-200/60"
                }`}
              >
                {!isMe && (
                  <p className="text-[11px] font-semibold mb-1 text-gray-600">
                    {senderName}
                  </p>
                )}
                {msg.content && <p className="whitespace-pre-wrap">{msg.content}</p>}
                
                {isImageAttachment && (
                  <a href={msg.file_url!} target="_blank" rel="noopener noreferrer" className="block mt-2">
                    <img
                      src={msg.file_url!}
                      alt={msg.file_name ?? "Attached image"}
                      className="max-w-[240px] max-h-[240px] rounded-lg border border-gray-200/50 object-cover hover:opacity-95 transition-opacity"
                    />
                  </a>
                )}

                {isVoiceNote ? (
                  <audio controls src={msg.file_url!} className="mt-2 max-w-[220px]" />
                ) : (
                  msg.file_url &&
                    !isImageAttachment && (
                      <a
                        href={msg.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1.5 mt-2 text-xs font-medium underline ${
                          isMe ? "text-white" : "text-[#1A73E8]"
                        }`}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        <span>{msg.file_name ?? "Attached file"}</span>
                      </a>
                    )
                )}

                <p className={`text-[10px] mt-1 text-right ${isMe ? "text-blue-100" : "text-gray-400"}`}>
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

      {/* Input Action Bar */}
      <form onSubmit={handleSend} className="border-t border-gray-200 p-3 bg-white space-y-2">
        {file && (
          <div className="flex items-center justify-between text-xs bg-[#E8F0FE] text-[#1A73E8] border border-blue-200 rounded-md px-3 py-1.5">
            <span className="truncate flex items-center gap-1.5 font-medium">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              {file.name}
            </span>
            <button
              type="button"
              onClick={() => setFile(null)}
              className="text-[#1A73E8] hover:text-blue-800 ml-2"
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* File Upload Button */}
          <label className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full cursor-pointer transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="hidden"
            />
          </label>

          {/* Voice Note Button */}
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-2 rounded-full transition-colors ${
              isRecording
                ? "bg-red-50 text-red-600 animate-pulse"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
            title={isRecording ? "Stop Recording" : "Record Voice Note"}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>

          {/* Message Input Box */}
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a message..."
            className="flex-1 bg-[#F1F3F4] border-none rounded-full px-4 py-2 text-xs text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={sending || (!text.trim() && !file)}
            className="bg-[#1A73E8] text-white p-2 rounded-full hover:bg-blue-600 disabled:opacity-40 disabled:hover:bg-[#1A73E8] transition-colors"
          >
            <svg className="w-4 h-4 transform rotate-90" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}