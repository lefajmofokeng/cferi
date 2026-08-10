"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import ChatThread from "@/components/admin/ChatThread";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

type Conversation = {
  id: string;
  type: "channel" | "dm";
  name: string | null;
  displayName: string;
};

type AdminUser = {
  id: string;
  full_name: string;
};

export default function AdminChatPage() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [teammates, setTeammates] = useState<AdminUser[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  async function loadEverything() {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    setCurrentUserId(user.id);

    // All admins, for starting new DMs.
    const { data: allAdmins } = await supabase
      .from("admin_users")
      .select("id, full_name")
      .neq("id", user.id);
    setTeammates(allAdmins ?? []);

    // Conversations this user is part of.
    const { data: participantRows } = await supabase
      .from("conversation_participants")
      .select("conversation_id")
      .eq("admin_id", user.id);

    const conversationIds = (participantRows ?? []).map((r) => r.conversation_id);
    if (conversationIds.length === 0) {
      setLoading(false);
      return;
    }

    const { data: convos } = await supabase
      .from("conversations")
      .select("id, type, name")
      .in("id", conversationIds);

    // For DMs, figure out the other participant's name to display.
    const resolved: Conversation[] = [];
    for (const convo of convos ?? []) {
      if (convo.type === "channel") {
        resolved.push({ ...convo, displayName: convo.name ?? "Team Channel" });
      } else {
        const { data: otherParticipants } = await supabase
          .from("conversation_participants")
          .select("admin_id")
          .eq("conversation_id", convo.id)
          .neq("admin_id", user.id);

        const otherId = otherParticipants?.[0]?.admin_id;
        const other = (allAdmins ?? []).find((a) => a.id === otherId);
        resolved.push({ ...convo, displayName: other?.full_name ?? "Direct Message" });
      }
    }

    setConversations(resolved);
    setLoading(false);
  }

  useEffect(() => {
    loadEverything();
  }, []);

  async function startOrOpenDM(teammateId: string) {
    // Check if a DM with this teammate already exists in what we've loaded.
    const supabase = createClient();

    for (const convo of conversations) {
      if (convo.type === "dm") {
        const { data: participants } = await supabase
          .from("conversation_participants")
          .select("admin_id")
          .eq("conversation_id", convo.id);
        const ids = (participants ?? []).map((p) => p.admin_id);
        if (ids.includes(teammateId) && currentUserId && ids.includes(currentUserId)) {
          setSelectedConversationId(convo.id);
          return;
        }
      }
    }

    // No existing DM — create one. We generate the id ourselves so we
    // never need Supabase to "return" the row before we're a participant.
    if (!currentUserId) return;

    const newConversationId = crypto.randomUUID();

    const { error: convoError } = await supabase
      .from("conversations")
      .insert({ id: newConversationId, type: "dm" });

    if (convoError) return;

    const { error: participantsError } = await supabase
      .from("conversation_participants")
      .insert([
        { conversation_id: newConversationId, admin_id: currentUserId },
        { conversation_id: newConversationId, admin_id: teammateId },
      ]);

    if (participantsError) return;

    await loadEverything();
    setSelectedConversationId(newConversationId);
  }

  if (loading) {
    return (
      <main className="p-6 font-sans text-gray-800 max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-24 text-xs font-semibold text-gray-400 gap-2">
          <svg className="w-4 h-4 animate-spin text-gray-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Loading messages...</span>
        </div>
      </main>
    );
  }

  const activeConvo = conversations.find((c) => c.id === selectedConversationId);

  async function handleClearConversation() {
  if (!selectedConversationId) return;
  const supabase = createClient();
  await supabase
    .from("chat_messages")
    .delete()
    .eq("conversation_id", selectedConversationId);
  setShowClearConfirm(false);
  // Force ChatThread to reload by briefly clearing and reselecting.
  const id = selectedConversationId;
  setSelectedConversationId(null);
  setTimeout(() => setSelectedConversationId(id), 0);
}

  return (
    <main className="p-6 font-sans text-gray-800 max-w-7xl mx-auto h-[calc(100vh-80px)] flex flex-col space-y-4">
      {/* Top Section Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-1">
            <span>Admin</span>
            <span>/</span>
            <span className="text-gray-800">Messages</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Team Workspace
          </h1>
        </div>
      </div>

      {/* Main Split Interface */}
      <div className="flex-1 bg-white rounded-[15px] border border-gray-200/80 shadow-xs overflow-hidden flex min-h-0">
        {/* Left Sidebar Pane */}
        <aside className="w-72 border-r border-gray-100 bg-gray-50/40 flex flex-col shrink-0">
          <div className="p-4 border-b border-gray-100/80">
            <div className="relative">
              <input
                type="text"
                placeholder="Jump to or search..."
                className="w-full bg-white border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-gray-700 placeholder:text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
              />
              <svg className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="p-3 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
            {/* Channels Group */}
            <div>
              <div className="px-2 mb-1.5 flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Channels
                </span>
                <span className="text-[10px] font-semibold text-gray-400 bg-gray-200/60 px-1.5 py-0.2 rounded-md">
                  {conversations.filter((c) => c.type === "channel").length}
                </span>
              </div>
              <div className="space-y-0.5">
                {conversations
                  .filter((c) => c.type === "channel")
                  .map((c) => {
                    const isSelected = selectedConversationId === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => setSelectedConversationId(c.id)}
                        className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          isSelected
                            ? "bg-gray-900 text-white font-semibold"
                            : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900"
                        }`}
                      >
                        <span className={`text-xs ${isSelected ? "text-gray-300" : "text-gray-400"}`}>#</span>
                        <span className="truncate">{c.displayName}</span>
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Direct Messages Group */}
            <div>
              <div className="px-2 mb-1.5 flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Direct Messages
                </span>
                <span className="text-[10px] font-semibold text-gray-400 bg-gray-200/60 px-1.5 py-0.2 rounded-md">
                  {conversations.filter((c) => c.type === "dm").length}
                </span>
              </div>
              <div className="space-y-0.5">
                {conversations
                  .filter((c) => c.type === "dm")
                  .map((c) => {
                    const isSelected = selectedConversationId === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => setSelectedConversationId(c.id)}
                        className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          isSelected
                            ? "bg-gray-900 text-white font-semibold"
                            : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900"
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full shrink-0 ${isSelected ? "bg-emerald-400" : "bg-emerald-500"}`} />
                        <span className="truncate">{c.displayName}</span>
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Teammates Group */}
            <div>
              <div className="px-2 mb-1.5 flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Start New Chat
                </span>
              </div>
              <div className="space-y-0.5">
                {teammates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => startOrOpenDM(t.id)}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-100/80 hover:text-gray-900 transition-colors group"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-600 text-[10px] font-bold flex items-center justify-center shrink-0">
                        {t.full_name.charAt(0).toUpperCase()}
                      </span>
                      <span className="truncate">{t.full_name}</span>
                    </div>
                    <svg className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Right Chat Thread Pane */}
        <section className="flex-1 flex flex-col min-w-0 bg-white">
          {selectedConversationId && currentUserId ? (
            <>
              {/* Header Bar */}
              <div className="px-6 py-3.5 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
  <div className="flex items-center gap-2">
    <span className="text-xs font-bold text-gray-900">
      {activeConvo?.type === "channel" ? `# ${activeConvo.displayName}` : activeConvo?.displayName}
    </span>
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] font-medium text-emerald-700 border border-emerald-200/60">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      Active
    </span>
  </div>
  <button
    onClick={() => setShowClearConfirm(true)}
    className="text-xs text-gray-400 hover:text-red-600"
  >
    Clear Conversation
  </button>
</div>

              {/* Chat Thread Container */}
              <div className="flex-1 min-h-0">
                <ChatThread
                  conversationId={selectedConversationId}
                  currentUserId={currentUserId}
                />
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-xs font-semibold text-gray-700 mb-1">No conversation selected</p>
              <p className="text-[11px] text-gray-400 max-w-xs">
                Choose an existing channel or select a teammate from the left sidebar to start messaging.
              </p>
            </div>
          )}
        </section>
      </div>

      <ConfirmDialog
  open={showClearConfirm}
  title="Clear this conversation?"
  description="This deletes every message for everyone. This can't be undone."
  confirmLabel="Clear"
  onConfirm={handleClearConversation}
  onCancel={() => setShowClearConfirm(false)}
/>
    </main>
  );
}