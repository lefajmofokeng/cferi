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
        .select("role")
        .eq("id", user.id)
        .single();
      setCurrentUserRole(me?.role ?? null);
    }

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
      {/* Top Breadcrumb & Title Header */}
      <header className="firebase-header">
        <nav className="firebase-breadcrumb">
          <span>Admin</span>
          <span className="firebase-breadcrumb-separator">/</span>
          <span className="firebase-breadcrumb-active">Team</span>
        </nav>
        <h1 className="firebase-title">Team Management</h1>
      </header>

      {/* Firebase Underline Navigation Tabs */}
      <div className="firebase-nav-bar">
        <button
          type="button"
          className={`firebase-tab ${activeTab === "team" ? "firebase-tab-active" : ""}`}
          onClick={() => setActiveTab("team")}
        >
          Team Members
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
              <div className="firebase-card-header">
                <h2 className="firebase-card-title">Team Members ({team.length})</h2>
              </div>

              {resetError && <p className="firebase-alert firebase-alert-error">{resetError}</p>}

              <div className="firebase-table-wrapper">
                <table className="firebase-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Added</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {team.map((member) => {
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
                              <span>{member.full_name}</span>
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
                              {new Date(member.created_at).toLocaleDateString()}
                            </td>
                            <td>
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
                                      <strong>Joined:</strong>{" "}
                                      {new Date(member.created_at).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
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
              </div>

              <form onSubmit={handleSaveProfile} className="firebase-form">
                <div className="firebase-field">
                  <label className="firebase-label">Profile Photo</label>
                  {myAvatarUrl && !avatarFile && (
                    <img
                      src={myAvatarUrl}
                      alt="Current avatar"
                      className="firebase-avatar-lg"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
                    className="firebase-file-input"
                  />
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
                    className="firebase-input"
                  />
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
              </div>

              <form onSubmit={handleChangePassword} className="firebase-form">
                <div className="firebase-field">
                  <label className="firebase-label">New Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="firebase-input"
                  />
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
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
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
    </section>
  );
}