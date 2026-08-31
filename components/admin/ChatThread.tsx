"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import "./ChatThread.css";

type Message = {
  id: string;
  sender_id: string;
  content: string | null;
  file_url: string | null;
  file_name: string | null;
  created_at: string;
};

type SenderInfo = { full_name: string; avatar_url: string | null };
type SenderMap = Record<string, SenderInfo>;

function isImageFile(fileName: string | null): boolean {
  if (!fileName) return false;
  return /\.(png|jpe?g|gif|webp|svg)$/i.test(fileName);
}

interface ChatThreadProps {
  conversationId: string;
  currentUserId: string;
  id?: string;
}

export default function ChatThread({
  conversationId,
  currentUserId,
  id = "chat-thread",
}: ChatThreadProps) {
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
          .select("id, full_name, avatar_url")
          .in("id", senderIds);

        const map: SenderMap = {};
        (senders ?? []).forEach((s) => {
          map[s.id] = { full_name: s.full_name, avatar_url: s.avatar_url };
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
              .select("full_name, avatar_url")
              .eq("id", newMsg.sender_id)
              .single()
              .then(({ data }) => {
                if (data) {
                  setSenderNames((current) => ({
                    ...current,
                    [newMsg.sender_id]: { full_name: data.full_name, avatar_url: data.avatar_url },
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
    <section id={id} className="chat-thread">
      {/* Message Feed Area */}
      <div className="chat-thread__messages">
        {messages.map((msg) => {
          const isMe = msg.sender_id === currentUserId;
          const normalizedFileName = (msg.file_name ?? "").toLowerCase();
          const isVoiceNote = !!msg.file_url && normalizedFileName.includes("voice-note");
          const isImageAttachment = !!msg.file_url && isImageFile(msg.file_name);
          const senderInfo = senderNames[msg.sender_id];
          const senderName = senderInfo?.full_name ?? "Team Member";

          return (
            <div
              key={msg.id}
              className={`chat-thread__message-row ${
                isMe ? "chat-thread__message-row--me" : "chat-thread__message-row--other"
              }`}
            >
              {!isMe && (
                senderInfo?.avatar_url ? (
                  <img
                    src={senderInfo.avatar_url}
                    alt={senderName}
                    className="chat-thread__avatar-img"
                  />
                ) : (
                  <div className="chat-thread__avatar">
                    {senderName.charAt(0).toUpperCase()}
                  </div>
                )
              )}

              <div
                className={`chat-thread__bubble ${
                  isMe ? "chat-thread__bubble--me" : "chat-thread__bubble--other"
                }`}
              >
                {!isMe && (
                  <p className="chat-thread__sender-name">
                    {senderName}
                  </p>
                )}
                {msg.content && <p className="chat-thread__content">{msg.content}</p>}
                
                {isImageAttachment && (
                  <a href={msg.file_url!} target="_blank" rel="noopener noreferrer" className="chat-thread__image-link">
                    <img
                      src={msg.file_url!}
                      alt={msg.file_name ?? "Attached image"}
                      className="chat-thread__image"
                    />
                  </a>
                )}

                {isVoiceNote ? (
                  <audio controls src={msg.file_url!} className="chat-thread__audio" />
                ) : (
                  msg.file_url &&
                    !isImageAttachment && (
                      <a
                        href={msg.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`chat-thread__file-link ${
                          isMe ? "chat-thread__file-link--me" : "chat-thread__file-link--other"
                        }`}
                      >
                        <svg className="chat-thread__icon-file" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        <span>{msg.file_name ?? "Attached file"}</span>
                      </a>
                    )
                )}

                <p className={`chat-thread__timestamp ${isMe ? "chat-thread__timestamp--me" : "chat-thread__timestamp--other"}`}>
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
      <form onSubmit={handleSend} className="chat-thread__form">
        {file && (
          <div className="chat-thread__file-preview">
            <span className="chat-thread__file-name">
              <svg className="chat-thread__icon-file" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              {file.name}
            </span>
            <button
              type="button"
              onClick={() => setFile(null)}
              className="chat-thread__remove-file"
            >
              ✕
            </button>
          </div>
        )}

        <div className="chat-thread__input-row">
          {/* File Upload Button */}
          <label className="chat-thread__action-btn">
            <svg className="chat-thread__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="chat-thread__file-input"
            />
          </label>

          {/* Voice Note Button */}
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            className={`chat-thread__action-btn ${
              isRecording ? "chat-thread__action-btn--recording" : ""
            }`}
            title={isRecording ? "Stop Recording" : "Record Voice Note"}
          >
            <svg className="chat-thread__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>

          {/* Message Input Box */}
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a message..."
            className="chat-thread__input"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={sending || (!text.trim() && !file)}
            className="chat-thread__send-btn"
          >
            <svg className="chat-thread__send-icon" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </form>
    </section>
  );
}