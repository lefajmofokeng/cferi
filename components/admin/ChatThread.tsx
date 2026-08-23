"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

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
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioStreamRef = useRef<MediaStream | null>(null);

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

  async function handleClearConversation() {
    const supabase = createClient();
    const { error } = await supabase
        .from("chat_messages")
        .delete()
        .eq("conversation_id", conversationId);

    if (!error) {
        setMessages([]);
    }
    setShowClearConfirm(false);
}

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {messages.map((msg) => {
          const isMe = msg.sender_id === currentUserId;
          const normalizedFileName = (msg.file_name ?? "").toLowerCase();
          const isVoiceNote = !!msg.file_url && normalizedFileName.includes("voice-note");
          const isImageAttachment = !!msg.file_url && isImageFile(msg.file_name);

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
                {isImageAttachment && (
                  <a href={msg.file_url!} target="_blank" rel="noopener noreferrer" className="block mt-1">
                    <img
                      src={msg.file_url!}
                      alt={msg.file_name ?? "Attached image"}
                      className="max-w-[220px] max-h-[220px] rounded object-cover"
                    />
                  </a>
                )}
                {isVoiceNote ? (
                  <audio controls src={msg.file_url!} className="mt-1 max-w-[220px]" />
                ) : (
                  msg.file_url &&
                    !isImageAttachment && (
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
                    )
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

      <form onSubmit={handleSend} className="border-t border-gray-200 p-4 space-y-2">
  {file && (
    <div className="flex items-center justify-between text-xs bg-gray-50 border border-gray-200 rounded px-3 py-1.5">
      <span className="truncate">📎 {file.name}</span>
      <button
        type="button"
        onClick={() => setFile(null)}
        className="text-gray-400 hover:text-gray-700 ml-2"
      >
        ✕
      </button>
    </div>
  )}
  <div className="flex gap-2">
    <label className="border border-gray-300 rounded px-3 py-2 text-sm cursor-pointer hover:bg-gray-50">
      📎
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="hidden"
      />
    </label>
    <button
  type="button"
  onClick={isRecording ? stopRecording : startRecording}
  className={`border rounded px-3 py-2 text-sm ${
    isRecording
      ? "border-red-400 bg-red-50 text-red-600 animate-pulse"
      : "border-gray-300 hover:bg-gray-50"
  }`}
>
  {isRecording ? "⏹ Stop" : "🎙️"}
</button>
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
  </div>
</form>
    </div>
  );
}