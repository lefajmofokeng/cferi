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
  const [searchQuery, setSearchQuery] = useState("");

  async function loadEverything() {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    setCurrentUserId(user.id);

    const { data: allAdmins } = await supabase
      .from("admin_users")
      .select("id, full_name")
      .neq("id", user.id);
    setTeammates(allAdmins ?? []);

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

  async function handleClearConversation() {
    if (!selectedConversationId) return;
    const supabase = createClient();
    await supabase
      .from("chat_messages")
      .delete()
      .eq("conversation_id", selectedConversationId);
    setShowClearConfirm(false);

    const id = selectedConversationId;
    setSelectedConversationId(null);
    setTimeout(() => setSelectedConversationId(id), 0);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8F9FA] p-6 font-sans text-gray-700">
        <div className="flex flex-col items-center justify-center py-32 text-xs font-medium text-gray-500 gap-3">
          <svg className="w-5 h-5 animate-spin text-[#1A73E8]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Loading project messages...</span>
        </div>
      </main>
    );
  }

  const activeConvo = conversations.find((c) => c.id === selectedConversationId);

  const filteredChannels = conversations
    .filter((c) => c.type === "channel")
    .filter((c) => c.displayName.toLowerCase().includes(searchQuery.toLowerCase()));

  const filteredDMs = conversations
    .filter((c) => c.type === "dm")
    .filter((c) => c.displayName.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <main className="h-screen bg-[#F8F9FA] font-sans text-gray-800 p-6 flex flex-col space-y-4 overflow-hidden">
      {/* Embedded CSS for seamless Firebase-style scrollbar */}
      <style jsx global>{`
        .firebase-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .firebase-scrollbar::-webkit-scrollbar-button {
          display: none;
          width: 0;
          height: 0;
        }
        .firebase-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .firebase-scrollbar::-webkit-scrollbar-thumb {
          background-color: #dadce0;
          border-radius: 4px;
        }
        .firebase-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #bdc1c6;
        }
        .firebase-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #dadce0 transparent;
        }
      `}</style>

      {/* Firebase Header */}
      <div className="flex items-center justify-between shrink-0 px-1">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-normal mb-0.5">
            <span>Project</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">Realtime Messaging</span>
          </div>
          <h1 className="text-xl font-normal text-gray-900 tracking-tight">
            In-App Messaging
          </h1>
        </div>
      </div>

      {/* Firebase Main Card View */}
      <div className="flex-1 bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden flex min-h-0">
        
        {/* Left Navigation Panel */}
        <aside className="w-80 border-r border-gray-200 bg-[#FFFFFF] flex flex-col shrink-0">
          
          {/* Search Box */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter channels or people..."
                className="w-full bg-[#F1F3F4] border-none rounded-md pl-9 pr-3 py-1.5 text-xs text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
              />
              <svg className="w-4 h-4 text-gray-500 absolute left-2.5 top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Navigation Items Container */}
          <div className="p-2 overflow-y-auto space-y-4 flex-1 firebase-scrollbar">
            
            {/* Channels */}
            <div>
              <div className="px-3 py-1 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Channels
                </span>
                <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.2 rounded-full">
                  {filteredChannels.length}
                </span>
              </div>
              <div className="space-y-0.5 mt-1">
                {filteredChannels.map((c) => {
                  const isSelected = selectedConversationId === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedConversationId(c.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs transition-colors ${
                        isSelected
                          ? "bg-[#E8F0FE] text-[#1A73E8] font-semibold"
                          : "text-gray-700 hover:bg-gray-100 font-normal"
                      }`}
                    >
                      <span className={isSelected ? "text-[#1A73E8]" : "text-gray-400"}>#</span>
                      <span className="truncate">{c.displayName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Direct Messages */}
            <div>
              <div className="px-3 py-1 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Direct Messages
                </span>
                <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.2 rounded-full">
                  {filteredDMs.length}
                </span>
              </div>
              <div className="space-y-0.5 mt-1">
                {filteredDMs.map((c) => {
                  const isSelected = selectedConversationId === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedConversationId(c.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs transition-colors ${
                        isSelected
                          ? "bg-[#E8F0FE] text-[#1A73E8] font-semibold"
                          : "text-gray-700 hover:bg-gray-100 font-normal"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full shrink-0 ${isSelected ? "bg-[#1A73E8]" : "bg-emerald-500"}`} />
                      <span className="truncate">{c.displayName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Start New Chat (Teammates) */}
            <div>
              <div className="px-3 py-1 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Teammates
                </span>
              </div>
              <div className="space-y-0.5 mt-1">
                {teammates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => startOrOpenDM(t.id)}
                    className="w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs font-normal text-gray-600 hover:bg-gray-100 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-[11px] font-semibold flex items-center justify-center shrink-0">
                        {t.full_name.charAt(0).toUpperCase()}
                      </span>
                      <span className="truncate">{t.full_name}</span>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Central Chat Thread View */}
        <section className="flex-1 flex flex-col min-w-0 bg-white">
          {selectedConversationId && currentUserId ? (
            <>
              {/* Header Bar */}
              <div className="h-14 px-6 border-b border-gray-200 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-medium text-gray-900">
                    {activeConvo?.type === "channel" ? `# ${activeConvo.displayName}` : activeConvo?.displayName}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-[11px] font-medium text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Active
                  </span>
                </div>
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  Clear Thread
                </button>
              </div>

              {/* Chat Thread Component */}
              <div className="flex-1 min-h-0">
                <ChatThread
                  conversationId={selectedConversationId}
                  currentUserId={currentUserId}
                />
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-[#F8F9FA]/40">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-[#1A73E8] flex items-center justify-center mb-3 border border-blue-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">Select a conversation</p>
              <p className="text-xs text-gray-500 max-w-xs">
                Pick a channel or a team member from the list on the left to display the message logs.
              </p>
            </div>
          )}
        </section>
      </div>

      <ConfirmDialog
        open={showClearConfirm}
        title="Clear conversation history?"
        description="This removes all messages in this thread. This action cannot be reversed."
        confirmLabel="Clear history"
        onConfirm={handleClearConversation}
        onCancel={() => setShowClearConfirm(false)}
      />
    </main>
  );
}