"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import "./AdminTeamManagement.css";

type AdminUser = {
  id: string;
  full_name: string;
  role: string;
  created_at: string;
  phone: string | null;
  job_title: string | null;
  avatar_url: string | null;
};

export default function AdminTeamManagement({ id = "admin-team-management" }: { id?: string }) {
  const [activeTab, setActiveTab] = useState<"team" | "profile" | "password" | "add-admin">("team");

  const [team, setTeam] = useState<AdminUser[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("editor");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const [resetTargetId, setResetTargetId] = useState<string | null>(null);
  const [resetPassword, setResetPassword] = useState("");
  const [resetting, setResetting] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetSuccessId, setResetSuccessId] = useState<string | null>(null);

  const [myFullName, setMyFullName] = useState("");
  const [myPhone, setMyPhone] = useState("");
  const [myJobTitle, setMyJobTitle] = useState("");
  const [myAvatarUrl, setMyAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

  const [expandedMemberId, setExpandedMemberId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [bannerDismissed, setBannerDismissed] = useState(false);

  async function handleResetPassword(targetUserId: string) {
    setResetting(true);
    setResetError("");

    const res = await fetch("/api/admin/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetUserId, newPassword: resetPassword }),
    });

    const result = await res.json();

    if (!res.ok) {
      setResetError(result.error ?? "Something went wrong.");
    } else {
      setResetSuccessId(targetUserId);
      setResetPassword("");
      setResetTargetId(null);
    }
    setResetting(false);
  }

  async function loadTeam() {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: me } = await supabase
        .from("admin_users")
        .select("role, full_name, phone, job_title, avatar_url")
        .eq("id", user.id)
        .single();
      setCurrentUserRole(me?.role ?? null);
      if (me) {
        setMyFullName(me.full_name ?? "");
        setMyPhone(me.phone ?? "");
        setMyJobTitle(me.job_title ?? "");
        setMyAvatarUrl(me.avatar_url);
      }
    }

    const { data } = await supabase
      .from("admin_users")
      .select("id, full_name, role, created_at, phone, job_title, avatar_url")
      .order("created_at", { ascending: true });

    setTeam(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadTeam();
  }, []);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    setProfileError("");
    setProfileSuccess("");

    const supabase = createClient();
    let finalAvatarUrl = myAvatarUrl;

    if (avatarFile) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const filePath = `${user.id}-${Date.now()}-${avatarFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatarFile);

      if (uploadError) {
        setProfileError(`Photo upload failed: ${uploadError.message}`);
        setSavingProfile(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);
      finalAvatarUrl = publicUrlData.publicUrl;
    }

    const { error } = await supabase.rpc("update_own_profile", {
      new_full_name: myFullName,
      new_phone: myPhone || null,
      new_job_title: myJobTitle || null,
      new_avatar_url: finalAvatarUrl,
    });

    if (error) {
      setProfileError(error.message);
    } else {
      setProfileSuccess("Profile updated successfully.");
      setMyAvatarUrl(finalAvatarUrl);
      setAvatarFile(null);
      loadTeam();
    }
    setSavingProfile(false);
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setChangingPassword(true);
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      setChangingPassword(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setPasswordError(error.message);
    } else {
      setPasswordSuccess("Password updated successfully.");
      setNewPassword("");
    }
    setChangingPassword(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError("");
    setSuccess("");

    const res = await fetch("/api/admin/create-admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, fullName, role }),
    });

    const result = await res.json();

    if (!res.ok) {
      setError(result.error ?? "Something went wrong.");
    } else {
      setSuccess(`${fullName} has been added as ${role}.`);
      setFullName("");
      setEmail("");
      setPassword("");
      setRole("editor");
      loadTeam();
    }
    setCreating(false);
  }

  const filteredTeam = team.filter(
    (member) =>
      member.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.job_title && member.job_title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <section id={id} className="firebase-admin-container">
        <div className="firebase-loading-state">
          <svg className="firebase-spinner" viewBox="0 0 24 24">
            <circle className="firebase-spinner-track" cx="12" cy="12" r="10" strokeWidth="4" />
            <path className="firebase-spinner-head" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>Loading team members...</span>
        </div>
      </section>
    );
  }

  return (
    <section id={id} className="firebase-admin-container">
      <div className="firebase-centered-layout">
        {/* Top Breadcrumb & Title Header */}
        <header className="firebase-header">
          <nav className="firebase-breadcrumb">
            <span>Admin</span>
            <span className="firebase-breadcrumb-separator">/</span>
            <span className="firebase-breadcrumb-active">Team Management</span>
          </nav>
          <div className="firebase-title-row">
            <h1 className="firebase-title">Team Management</h1>
            <div className="firebase-header-actions">
              <button
                type="button"
                className="firebase-btn firebase-btn-secondary"
                onClick={loadTeam}
                title="Refresh Team List"
              >
                <svg className="firebase-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </header>

        {/* Firebase Global Notice Banner */}
        {!bannerDismissed && (
          <div className="firebase-info-banner">
            <div className="firebase-info-banner-content">
              <span className="firebase-info-icon">i</span>
              <p className="firebase-info-text">
                Password requirements enforce strict identity verification guidelines. Administrators should review account credentials periodically to maintain system integrity.
                <a href="/terms" className="firebase-info-link">
                  Learn more about security policies
                </a>
              </p>
            </div>
            <button
              type="button"
              className="firebase-info-dismiss"
              onClick={() => setBannerDismissed(true)}
              aria-label="Dismiss announcement"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="firebase-dismiss-icon">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Firebase Underline Navigation Tabs */}
        <div className="firebase-nav-bar">
          <button
            type="button"
            className={`firebase-tab ${activeTab === "team" ? "firebase-tab-active" : ""}`}
            onClick={() => setActiveTab("team")}
          >
            Team Members ({team.length})
          </button>
          <button
            type="button"
            className={`firebase-tab ${activeTab === "profile" ? "firebase-tab-active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            My Profile
          </button>
          <button
            type="button"
            className={`firebase-tab ${activeTab === "password" ? "firebase-tab-active" : ""}`}
            onClick={() => setActiveTab("password")}
          >
            Change My Password
          </button>
          {currentUserRole === "super_admin" && (
            <button
              type="button"
              className={`firebase-tab ${activeTab === "add-admin" ? "firebase-tab-active" : ""}`}
              onClick={() => setActiveTab("add-admin")}
            >
              Add New Admin
            </button>
          )}
        </div>

        {/* Main Tab Views */}
        <div className="firebase-content-body">
          {/* TAB 1: Team Members List */}
          {activeTab === "team" && (
            <div className="firebase-section">
              <div className="firebase-card">
                <div className="firebase-card-header firebase-card-header-flex">
                  <div>
                    <h2 className="firebase-card-title">Team Members</h2>
                    <p className="firebase-card-subtitle">
                      Manage administrator permissions and system access levels.
                    </p>
                  </div>
                  <div className="firebase-table-actions">
                    <div className="firebase-search-wrapper">
                      <svg className="firebase-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                      <input
                        type="text"
                        placeholder="Filter by name, role, title..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="firebase-input firebase-search-input"
                      />
                    </div>
                  </div>
                </div>

                {resetError && <p className="firebase-alert firebase-alert-error">{resetError}</p>}

                <div className="firebase-table-wrapper">
                  <table className="firebase-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Added</th>
                        <th style={{ textAlign: "right" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTeam.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="firebase-table-empty">
                            No team members found matching "{searchQuery}".
                          </td>
                        </tr>
                      ) : (
                        filteredTeam.map((member) => {
                          const isSuper = member.role === "super_admin";
                          const isAdmin = member.role === "admin";
                          const isExpanded = expandedMemberId === member.id;

                          return (
                            <React.Fragment key={member.id}>
                              <tr className="firebase-table-row">
                                <td
                                  className="firebase-user-cell"
                                  onClick={() => setExpandedMemberId(isExpanded ? null : member.id)}
                                >
                                  {member.avatar_url ? (
                                    <img
                                      src={member.avatar_url}
                                      alt={member.full_name}
                                      className="firebase-avatar"
                                    />
                                  ) : (
                                    <span className="firebase-avatar-fallback">
                                      {member.full_name.charAt(0).toUpperCase()}
                                    </span>
                                  )}
                                  <div className="firebase-user-info">
                                    <span className="firebase-user-name">{member.full_name}</span>
                                    {member.job_title && (
                                      <span className="firebase-user-title">{member.job_title}</span>
                                    )}
                                  </div>
                                </td>
                                <td>
                                  <span
                                    className={`firebase-badge ${
                                      isSuper
                                        ? "firebase-badge-purple"
                                        : isAdmin
                                        ? "firebase-badge-blue"
                                        : "firebase-badge-gray"
                                    }`}
                                  >
                                    {member.role.replace("_", " ")}
                                  </span>
                                </td>
                                <td className="firebase-date-cell">
                                  {new Date(member.created_at).toLocaleDateString(undefined, {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </td>
                                <td style={{ textAlign: "right" }}>
                                  {currentUserRole === "super_admin" && (
                                    <>
                                      {resetTargetId === member.id ? (
                                        <div className="firebase-reset-inline">
                                          <input
                                            type="password"
                                            placeholder="New password"
                                            value={resetPassword}
                                            onChange={(e) => setResetPassword(e.target.value)}
                                            className="firebase-input firebase-input-sm"
                                          />
                                          <button
                                            type="button"
                                            onClick={() => handleResetPassword(member.id)}
                                            disabled={resetting || resetPassword.length < 6}
                                            className="firebase-btn firebase-btn-primary firebase-btn-sm"
                                          >
                                            {resetting ? "..." : "Confirm"}
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setResetTargetId(null);
                                              setResetPassword("");
                                            }}
                                            className="firebase-btn-text"
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() => setResetTargetId(member.id)}
                                          className="firebase-link-btn"
                                        >
                                          Reset Password
                                        </button>
                                      )}
                                      {resetSuccessId === member.id && (
                                        <p className="firebase-text-success">Password reset successfully.</p>
                                      )}
                                    </>
                                  )}
                                </td>
                              </tr>
                              {isExpanded && (
                                <tr className="firebase-table-details-row">
                                  <td colSpan={4}>
                                    <div className="firebase-details-box">
                                      {member.avatar_url ? (
                                        <img
                                          src={member.avatar_url}
                                          alt={member.full_name}
                                          className="firebase-avatar-lg"
                                        />
                                      ) : (
                                        <div className="firebase-avatar-fallback-lg">
                                          {member.full_name.charAt(0).toUpperCase()}
                                        </div>
                                      )}
                                      <div className="firebase-details-list">
                                        <p>
                                          <strong>Job Title:</strong> {member.job_title || "Not set"}
                                        </p>
                                        <p>
                                          <strong>Phone:</strong> {member.phone || "Not set"}
                                        </p>
                                        <p>
                                          <strong>Joined System:</strong>{" "}
                                          {new Date(member.created_at).toLocaleString()}
                                        </p>
                                        <p>
                                          <strong>System ID:</strong>{" "}
                                          <code className="firebase-code-inline">{member.id}</code>
                                        </p>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: My Profile */}
          {activeTab === "profile" && (
            <div className="firebase-section firebase-section-narrow">
              <div className="firebase-card">
                <div className="firebase-card-header">
                  <h2 className="firebase-card-title">My Profile</h2>
                  <p className="firebase-card-subtitle">
                    Update your account details and contact details across the admin panel.
                  </p>
                </div>

                <form onSubmit={handleSaveProfile} className="firebase-form">
                  <div className="firebase-field">
                    <label className="firebase-label">Profile Photo</label>
                    <div className="firebase-avatar-upload-box">
                      {myAvatarUrl && !avatarFile ? (
                        <img
                          src={myAvatarUrl}
                          alt="Current avatar"
                          className="firebase-avatar-lg"
                        />
                      ) : (
                        <div className="firebase-avatar-fallback-lg">
                          {myFullName ? myFullName.charAt(0).toUpperCase() : "A"}
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
                        className="firebase-file-input"
                      />
                    </div>
                  </div>

                  <div className="firebase-field">
                    <label className="firebase-label">Full Name</label>
                    <input
                      type="text"
                      required
                      value={myFullName}
                      onChange={(e) => setMyFullName(e.target.value)}
                      className="firebase-input"
                    />
                  </div>

                  <div className="firebase-field">
                    <label className="firebase-label">Job Title</label>
                    <input
                      type="text"
                      value={myJobTitle}
                      onChange={(e) => setMyJobTitle(e.target.value)}
                      placeholder="e.g. Program Coordinator"
                      className="firebase-input"
                    />
                  </div>

                  <div className="firebase-field">
                    <label className="firebase-label">Phone</label>
                    <input
                      type="tel"
                      value={myPhone}
                      onChange={(e) => setMyPhone(e.target.value)}
                      placeholder="+27 00 000 0000"
                      className="firebase-input"
                    />
                  </div>

                  <div className="firebase-field-banner">
                    <span className="firebase-field-banner-icon">i</span>
                    <span>
                      Profile changes will instantly reflect on the team directory list.
                    </span>
                  </div>

                  <div className="firebase-form-actions">
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="firebase-btn firebase-btn-primary"
                    >
                      {savingProfile ? "Saving..." : "Save Profile"}
                    </button>
                  </div>
                  {profileError && <p className="firebase-alert firebase-alert-error">{profileError}</p>}
                  {profileSuccess && <p className="firebase-alert firebase-alert-success">{profileSuccess}</p>}
                </form>
              </div>
            </div>
          )}

          {/* TAB 3: Change Password */}
          {activeTab === "password" && (
            <div className="firebase-section firebase-section-narrow">
              <div className="firebase-card">
                <div className="firebase-card-header">
                  <h2 className="firebase-card-title">Change My Password</h2>
                  <p className="firebase-card-subtitle">
                    Ensure your account is using a long, random password to stay secure.
                  </p>
                </div>

                {/* Specific Password Guidance Banner (Firebase style) */}
                <div className="firebase-info-banner firebase-info-banner-card">
                  <div className="firebase-info-banner-content">
                    <span className="firebase-info-icon">i</span>
                    <p className="firebase-info-text">
                      Passwords must contain at least 6 characters. By updating your password, you agree to system security policies.
                      <a href="/privacy" className="firebase-info-link">
                        View Privacy Guidelines
                      </a>
                    </p>
                  </div>
                </div>

                <form onSubmit={handleChangePassword} className="firebase-form">
                  <div className="firebase-field">
                    <label className="firebase-label">New Password</label>
                    <div className="firebase-password-input-group">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        required
                        minLength={6}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="firebase-input firebase-password-input"
                      />
                      <button
                        type="button"
                        className="firebase-toggle-password-btn"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    <p className="firebase-field-hint">
                      Minimum 6 characters required. Use numbers and symbols for higher security.
                    </p>
                  </div>

                  <div className="firebase-form-actions">
                    <button
                      type="submit"
                      disabled={changingPassword}
                      className="firebase-btn firebase-btn-primary"
                    >
                      {changingPassword ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                  {passwordError && <p className="firebase-alert firebase-alert-error">{passwordError}</p>}
                  {passwordSuccess && <p className="firebase-alert firebase-alert-success">{passwordSuccess}</p>}
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: Add New Admin */}
          {activeTab === "add-admin" && currentUserRole === "super_admin" && (
            <div className="firebase-section firebase-section-narrow">
              <div className="firebase-card">
                <div className="firebase-card-header">
                  <h2 className="firebase-card-title">Add New Admin</h2>
                  <p className="firebase-card-subtitle">
                    Provision new administrator credentials for staff members.
                  </p>
                </div>

                {error && (
                  <div className="firebase-alert firebase-alert-error">
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="firebase-alert firebase-alert-success">
                    <span>{success}</span>
                  </div>
                )}

                <form onSubmit={handleCreate} className="firebase-form">
                  <div className="firebase-field">
                    <label className="firebase-label">
                      Full Name <span className="firebase-text-required">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Jane Doe"
                      className="firebase-input"
                    />
                  </div>

                  <div className="firebase-field">
                    <label className="firebase-label">
                      Email Address <span className="firebase-text-required">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="firebase-input"
                    />
                  </div>

                  <div className="firebase-field">
                    <label className="firebase-label">
                      Temporary Password <span className="firebase-text-required">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="firebase-input firebase-font-mono"
                    />
                    <p className="firebase-field-hint">
                      Share this with them directly — they can change it after logging in.
                    </p>
                  </div>

                  <div className="firebase-field">
                    <label className="firebase-label">Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="firebase-select"
                    >
                      <option value="editor">Editor (Read & Edit Content)</option>
                      <option value="admin">Admin (Full Operational Access)</option>
                      <option value="super_admin">Super Admin (User & Provisioning Access)</option>
                    </select>
                  </div>

                  <div className="firebase-info-banner firebase-info-banner-card">
                    <div className="firebase-info-banner-content">
                      <span className="firebase-info-icon">i</span>
                      <p className="firebase-info-text">
                        Creating an account grants immediate console access. Ensure you review account permissions beforehand.
                        <a href="/terms" className="firebase-info-link">
                          Terms of Use
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="firebase-form-actions">
                    <button
                      type="submit"
                      disabled={creating}
                      className="firebase-btn firebase-btn-primary"
                    >
                      {creating ? "Creating..." : "Add Admin Member"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}