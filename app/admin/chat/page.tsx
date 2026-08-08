"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import ChatThread from "@/components/admin/ChatThread";

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

    // No existing DM — create one.
    if (!currentUserId) return;

    const { data: newConvo, error } = await supabase
      .from("conversations")
      .insert({ type: "dm" })
      .select("id")
      .single();

    if (error || !newConvo) return;

    await supabase.from("conversation_participants").insert([
      { conversation_id: newConvo.id, admin_id: currentUserId },
      { conversation_id: newConvo.id, admin_id: teammateId },
    ]);

    await loadEverything();
    setSelectedConversationId(newConvo.id);
  }

  if (loading) {
    return <main className="px-8 py-8">Loading...</main>;
  }

  return (
    <main className="flex h-[calc(100vh-0px)]">
      <aside className="w-64 border-r border-gray-200 px-4 py-6 overflow-y-auto">
        <p className="text-xs uppercase text-gray-400 mb-2">Channel</p>
        {conversations
          .filter((c) => c.type === "channel")
          .map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedConversationId(c.id)}
              className={`block w-full text-left px-3 py-2 rounded text-sm mb-1 ${
                selectedConversationId === c.id
                  ? "bg-gray-100 font-medium"
                  : "hover:bg-gray-50"
              }`}
            >
              # {c.displayName}
            </button>
          ))}

        <p className="text-xs uppercase text-gray-400 mt-6 mb-2">Direct Messages</p>
        {conversations
          .filter((c) => c.type === "dm")
          .map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedConversationId(c.id)}
              className={`block w-full text-left px-3 py-2 rounded text-sm mb-1 ${
                selectedConversationId === c.id
                  ? "bg-gray-100 font-medium"
                  : "hover:bg-gray-50"
              }`}
            >
              {c.displayName}
            </button>
          ))}

        <p className="text-xs uppercase text-gray-400 mt-6 mb-2">Team</p>
        {teammates.map((t) => (
          <button
            key={t.id}
            onClick={() => startOrOpenDM(t.id)}
            className="block w-full text-left px-3 py-2 rounded text-sm mb-1 text-gray-500 hover:bg-gray-50"
          >
            + {t.full_name}
          </button>
        ))}
      </aside>

      <section className="flex-1">
        {selectedConversationId && currentUserId ? (
            <ChatThread
            conversationId={selectedConversationId}
            currentUserId={currentUserId}
            />
        ) : (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            Select a conversation to start messaging
            </div>
        )}
    </section>
    </main>
  );
}