"use client";

import { useEffect, useState, useRef } from "react";
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

  // Mobile Drawer Control State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const chatThreadRef = useRef<{ stopRecording: () => void } | null>(null);

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

  // Timer logic during active voice recording
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  function handleToggleRecording() {
    chatThreadRef.current?.stopRecording();
  }

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }

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
          setProfilePanelUserId(teammateId);
          setIsSidebarOpen(false);
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
    setProfilePanelUserId(teammateId);
    setIsSidebarOpen(false);
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
          <svg className="svg-icon text-icon-color" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
          </svg>
          In-App Messaging
        </h1>
      </header>

      {/* Main App Workspace */}
      <div className="google-chat-card">
        {/* Backdrop for mobile overlays */}
        {(isSidebarOpen || isProfileOpen) && (
          <div
            className="mobile-overlay-backdrop"
            onClick={() => {
              setIsSidebarOpen(false);
              setIsProfileOpen(false);
            }}
          />
        )}

        {/* Navigation Sidebar Drawer */}
        <aside className={`google-chat-sidebar ${isSidebarOpen ? "drawer-open" : ""}`}>
          <div className="sidebar-drawer-header">
            <span className="drawer-title">Conversations</span>
            <button
              className="drawer-close-btn"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close navigation"
            >
              <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>

          {/* Search Box */}
          <div className="google-chat-search-container">
            <div className="google-chat-search-wrapper">
              <svg className="svg-icon search-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
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
                      onClick={() => {
                        setSelectedConversationId(c.id);
                        setProfilePanelUserId(null);
                        setIsSidebarOpen(false);
                      }}
                      className={`google-chat-item ${isSelected ? "selected" : ""}`}
                    >
                      <svg className="svg-icon item-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 10V8h-4V4h-2v4h-4V4H8v4H4v2h4v4H4v2h4v4h2v-4h4v4h2v-4h4v-2h-4v-4h4zm-6 4h-4v-4h4v4z" />
                      </svg>
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
                      onClick={() => {
                        setSelectedConversationId(c.id);
                        if (c.otherUserId) setProfilePanelUserId(c.otherUserId);
                        setIsSidebarOpen(false);
                      }}
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
                    <svg className="svg-icon add-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                    </svg>
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
                  <button
                    className="mobile-nav-toggle"
                    onClick={() => setIsSidebarOpen(true)}
                    aria-label="Open sidebar menu"
                  >
                    <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                    </svg>
                  </button>
                  <svg className="svg-icon thread-type-icon" viewBox="0 0 24 24" fill="currentColor">
                    {activeConvo?.type === "channel" ? (
                      <path d="M20 10V8h-4V4h-2v4h-4V4H8v4H4v2h4v4H4v2h4v4h2v-4h4v4h2v-4h4v-2h-4v-4h4zm-6 4h-4v-4h4v4z" />
                    ) : (
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    )}
                  </svg>
                  <span className="thread-title">{activeConvo?.displayName}</span>
                  <span className="status-badge">
                    <span className="status-dot"></span>
                    Active
                  </span>
                </div>

                <div className="thread-actions">
                  <button
                    className="btn-icon-action mobile-info-toggle"
                    onClick={() => setIsProfileOpen(true)}
                    title="View details"
                    aria-label="View Contact Information"
                  >
                    <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="btn-clear-thread"
                    title="Clear history"
                  >
                    <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                    </svg>
                    <span className="clear-btn-text">Clear Thread</span>
                  </button>
                </div>
              </div>

              {/* Live Voice Recording Status Bar overlay */}
              {isRecording && (
                <div className="voice-recording-overlay">
                  <div className="recording-status">
                    <span className="recording-dot"></span>
                    <span className="recording-label">Recording audio message...</span>
                    <span className="recording-timer">{formatTime(recordingTime)}</span>
                  </div>
                  <div className="recording-wave">
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                  </div>
                  <button
                    className="recording-stop-btn"
                    onClick={handleToggleRecording}
                    type="button"
                  >
                    Done
                  </button>
                </div>
              )}

              {/* Chat Thread Area */}
              <div className="google-chat-thread-body">
                <ChatThread
                  ref={chatThreadRef}
                  conversationId={selectedConversationId}
                  currentUserId={currentUserId}
                  onRecordingChange={setIsRecording}
                />
              </div>
            </>
          ) : (
            <div className="google-chat-empty-state">
              <button
                className="mobile-nav-toggle empty-nav-toggle"
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Open sidebar menu"
              >
                <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                </svg>
                <span>Open Conversations</span>
              </button>
              <div className="empty-icon-container">
                <svg className="svg-icon empty-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 7V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h11c.55 0 1-.45 1-1z" />
                </svg>
              </div>
              <p className="empty-title">Select a conversation</p>
              <p className="empty-description">
                Pick a space or a team member from the menu to display active message logs.
              </p>
            </div>
          )}
        </section>

        {/* Profile/Contact Information Side Panel */}
        {activeConvo?.type === "channel" ? (
          <aside className={`google-chat-profile-panel ${isProfileOpen ? "panel-open" : ""}`}>
            <div className="profile-header">
              <span className="profile-title">Channel info</span>
              <button
                onClick={() => setIsProfileOpen(false)}
                className="profile-close-btn"
                aria-label="Close Channel Info"
              >
                <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>
            <div className="profile-body">
              <div className="profile-avatar-placeholder">
                <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 10V8h-4V4h-2v4h-4V4H8v4H4v2h4v4H4v2h4v4h2v-4h4v4h2v-4h4v-2h-4v-4h4zm-6 4h-4v-4h4v4z" />
                </svg>
              </div>
              <p className="profile-name">{activeConvo.displayName}</p>
              <p className="profile-role">
                Team-wide channel for group messages. This conversation cannot be removed.
              </p>
            </div>
          </aside>
        ) : (
          profilePanelUserId &&
          (() => {
            const member = teammates.find((t) => t.id === profilePanelUserId);
            if (!member) return null;
            return (
              <aside className={`google-chat-profile-panel ${isProfileOpen ? "panel-open" : ""}`}>
                <div className="profile-header">
                  <span className="profile-title">Contact info</span>
                  <button
                    onClick={() => {
                      setProfilePanelUserId(null);
                      setIsProfileOpen(false);
                    }}
                    className="profile-close-btn"
                    aria-label="Close Profile"
                  >
                    <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
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
                      <svg className="svg-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                      </svg>
                      <span>{member.phone}</span>
                    </div>
                  )}
                </div>
              </aside>
            );
          })()
        )}
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