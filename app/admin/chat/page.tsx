"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import ChatThread from "@/components/admin/ChatThread";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import "./AdminChatPage.css";

type Conversation = {
  id: string;
  type: "channel" | "dm";
  name: string | null;
  displayName: string;
  otherUserId?: string;
};

type AdminUser = {
  id: string;
  full_name: string;
  avatar_url: string | null;
  job_title: string | null;
  phone: string | null;
};

interface AdminChatPageProps {
  id?: string;
}

export default function AdminChatPage({ id = "admin-chat-page" }: AdminChatPageProps) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [teammates, setTeammates] = useState<AdminUser[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profilePanelUserId, setProfilePanelUserId] = useState<string | null>(null);

  async function loadEverything() {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    setCurrentUserId(user.id);

    const { data: allAdmins } = await supabase
      .from("admin_users")
      .select("id, full_name, avatar_url, job_title, phone")
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
        resolved.push({
          ...convo,
          displayName: other?.full_name ?? "Direct Message",
          otherUserId: otherId,
        });
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
      <section id={id} className="google-chat-page">
        <div className="google-chat-loading">
          <div className="google-chat-spinner"></div>
          <span>Loading project messages...</span>
        </div>
      </section>
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
    <section id={id} className="google-chat-page">
      {/* Header */}
      <header className="google-chat-header">
        <div className="google-chat-breadcrumb">
          <span>Project</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Realtime Messaging</span>
        </div>
        <h1 className="google-chat-title">
          <span className="google-icon text-icon-color">chat_bubble</span>
          In-App Messaging
        </h1>
      </header>

      {/* Main App Workspace */}
      <div className="google-chat-card">
        {/* Navigation Sidebar */}
        <aside className="google-chat-sidebar">
          {/* Search Box */}
          <div className="google-chat-search-container">
            <div className="google-chat-search-wrapper">
              <span className="google-icon search-icon">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Chat"
                className="google-chat-search-input"
              />
            </div>
          </div>

          {/* Navigation Items */}
          <div className="google-chat-nav-scroll custom-scrollbar">
            {/* Channels */}
            <div className="google-chat-section">
              <div className="google-chat-section-header">
                <span className="section-title">Space Channels</span>
                <span className="section-badge">{filteredChannels.length}</span>
              </div>
              <div className="google-chat-list">
                {filteredChannels.map((c) => {
                  const isSelected = selectedConversationId === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedConversationId(c.id)}
                      className={`google-chat-item ${isSelected ? "selected" : ""}`}
                    >
                      <span className="google-icon item-icon">tag</span>
                      <span className="item-label">{c.displayName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Direct Messages */}
            <div className="google-chat-section">
              <div className="google-chat-section-header">
                <span className="section-title">Direct Messages</span>
                <span className="section-badge">{filteredDMs.length}</span>
              </div>

              <div className="google-chat-list">
                {filteredDMs.map((c) => {
                  const isSelected = selectedConversationId === c.id;
                  const otherMember = teammates.find((t) => t.id === c.otherUserId);
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedConversationId(c.id)}
                      className={`google-chat-item ${isSelected ? "selected" : ""}`}
                    >
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          if (c.otherUserId) setProfilePanelUserId(c.otherUserId);
                        }}
                        className="avatar-wrapper"
                      >
                        {otherMember?.avatar_url ? (
                          <img
                            src={otherMember.avatar_url}
                            alt={c.displayName}
                            className="avatar-image"
                          />
                        ) : (
                          <span className="avatar-placeholder">
                            {c.displayName.charAt(0).toUpperCase()}
                          </span>
                        )}
                        <span className="status-indicator online"></span>
                      </span>
                      <span className="item-label">{c.displayName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Teammates */}
            <div className="google-chat-section">
              <div className="google-chat-section-header">
                <span className="section-title">Teammates</span>
              </div>
              <div className="google-chat-list">
                {teammates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => startOrOpenDM(t.id)}
                    className="google-chat-item teammate-item"
                  >
                    <div className="teammate-info">
                      <span className="avatar-placeholder">
                        {t.full_name.charAt(0).toUpperCase()}
                      </span>
                      <span className="item-label">{t.full_name}</span>
                    </div>
                    <span className="google-icon add-icon">add</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Central Chat Thread */}
        <section className="google-chat-main">
          {selectedConversationId && currentUserId ? (
            <>
              {/* Header Bar */}
              <div className="google-chat-thread-header">
                <div className="thread-title-area">
                  <span className="google-icon thread-type-icon">
                    {activeConvo?.type === "channel" ? "tag" : "person"}
                  </span>
                  <span className="thread-title">
                    {activeConvo?.displayName}
                  </span>
                  <span className="status-badge">
                    <span className="status-dot"></span>
                    Active
                  </span>
                </div>
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="btn-clear-thread"
                  title="Clear history"
                >
                  <span className="google-icon">delete_outline</span>
                  Clear Thread
                </button>
              </div>

              {/* Chat Thread Area */}
              <div className="google-chat-thread-body">
                <ChatThread
                  conversationId={selectedConversationId}
                  currentUserId={currentUserId}
                />
              </div>
            </>
          ) : (
            <div className="google-chat-empty-state">
              <div className="empty-icon-container">
                <span className="google-icon empty-icon">forum</span>
              </div>
              <p className="empty-title">Select a conversation</p>
              <p className="empty-description">
                Pick a space or a team member from the list on the left to display current message logs.
              </p>
            </div>
          )}
        </section>

        {/* Profile Sidebar */}
        {profilePanelUserId && (() => {
          const member = teammates.find((t) => t.id === profilePanelUserId);
          if (!member) return null;
          return (
            <aside className="google-chat-profile-panel">
              <div className="profile-header">
                <span className="profile-title">Contact info</span>
                <button
                  onClick={() => setProfilePanelUserId(null)}
                  className="profile-close-btn"
                  aria-label="Close Profile"
                >
                  <span className="google-icon">close</span>
                </button>
              </div>
              <div className="profile-body">
                {member.avatar_url ? (
                  <img
                    src={member.avatar_url}
                    alt={member.full_name}
                    className="profile-avatar"
                  />
                ) : (
                  <div className="profile-avatar-placeholder">
                    {member.full_name.charAt(0).toUpperCase()}
                  </div>
                )}
                <p className="profile-name">{member.full_name}</p>
                {member.job_title && (
                  <p className="profile-role">{member.job_title}</p>
                )}
                {member.phone && (
                  <div className="profile-contact-row">
                    <span className="google-icon">call</span>
                    <span>{member.phone}</span>
                  </div>
                )}
              </div>
            </aside>
          );
        })()}
      </div>

      <ConfirmDialog
        open={showClearConfirm}
        title="Clear conversation history?"
        description="This removes all messages in this thread. This action cannot be reversed."
        confirmLabel="Clear history"
        onConfirm={handleClearConversation}
        onCancel={() => setShowClearConfirm(false)}
      />
    </section>
  );
}