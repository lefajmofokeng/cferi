"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type AdminUser = {
  id: string;
  full_name: string;
  role: string;
  created_at: string;
  phone: string | null;
  job_title: string | null;
  avatar_url: string | null;
};

export default function AdminTeamPage() {
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
      <main className="p-6 font-sans text-gray-800 max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-24 text-xs font-semibold text-gray-400 gap-2">
          <svg className="w-4 h-4 animate-spin text-gray-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Loading team members...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 font-sans text-gray-800 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-1">
            <span>Admin</span>
            <span>/</span>
            <span className="text-gray-800">Team</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Team Management
          </h1>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Team Members List (Takes 2 Columns if Super Admin form present, or full width) */}
        <div className={currentUserRole === "super_admin" ? "lg:col-span-2 space-y-6" : "lg:col-span-3 space-y-6"}>
          <div className="bg-white rounded-[15px] border border-gray-200/80 shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gray-50/40">
              <span className="text-xs font-semibold text-gray-600">
                Team Members ({team.length})
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-gray-50 text-gray-600">
                  <tr className="text-left border-b border-gray-200 text-gray-500">
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">Role</th>
                    <th className="py-2 pr-4">Added</th>
                    <th className="py-2 pr-4"></th>
                  </tr>
                </thead>
                {resetError && <p className="text-red-600 text-sm mt-2">{resetError}</p>}
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {team.map((member) => {
                    const isSuper = member.role === "super_admin";
                    const isAdmin = member.role === "admin";

                  const isExpanded = expandedMemberId === member.id;

                    return (
                    <React.Fragment key={member.id}>
                      <tr key={member.id} className="hover:bg-gray-50/80 transition-colors">
                        <td
                          onClick={() =>
                            setExpandedMemberId(isExpanded ? null : member.id)
                          }
                          className="py-3.5 px-5 font-semibold text-gray-900 flex items-center gap-2.5 cursor-pointer"
                        >
                          {member.avatar_url ? (
                            <img
                              src={member.avatar_url}
                              alt={member.full_name}
                              className="w-7 h-7 rounded-full object-cover shrink-0 border border-gray-200/60"
                            />
                          ) : (
                            <span className="w-7 h-7 rounded-full bg-gray-100 text-gray-700 text-xs font-bold flex items-center justify-center shrink-0 border border-gray-200/60">
                              {member.full_name.charAt(0).toUpperCase()}
                            </span>
                          )}
                          <span>{member.full_name}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium capitalize ${
                              isSuper
                                ? "bg-purple-50 text-purple-700 border border-purple-200/60"
                                : isAdmin
                                ? "bg-blue-50 text-blue-700 border border-blue-200/60"
                                : "bg-gray-100 text-gray-600 border border-gray-200/60"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                isSuper ? "bg-purple-500" : isAdmin ? "bg-blue-500" : "bg-gray-400"
                              }`}
                            />
                            {member.role.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-gray-500 font-mono text-[11px]">
                          {new Date(member.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4">
                          {currentUserRole === "super_admin" && (
                            <>
                              {resetTargetId === member.id ? (
                                <div className="flex items-center gap-2">
                                  <input
                                    type="password"
                                    placeholder="New password"
                                    value={resetPassword}
                                    onChange={(e) => setResetPassword(e.target.value)}
                                    className="border border-gray-300 rounded px-2 py-1 text-sm w-32"
                                  />
                                  <button
                                    onClick={() => handleResetPassword(member.id)}
                                    disabled={resetting || resetPassword.length < 6}
                                    className="text-xs bg-black text-white px-3 py-1 rounded hover:opacity-90 disabled:opacity-50"
                                  >
                                    {resetting ? "..." : "Confirm"}
                                  </button>
                                  <button
                                    onClick={() => {
                                      setResetTargetId(null);
                                      setResetPassword("");
                                    }}
                                    className="text-xs text-gray-400"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setResetTargetId(member.id)}
                                  className="text-xs text-blue-600 hover:underline"
                                >
                                  Reset Password
                                </button>
                              )}
                              {resetSuccessId === member.id && (
                                <p className="text-xs text-green-700 mt-1">Password reset successfully.</p>
                              )}
                            </>
                          )}
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr key={`${member.id}-details`} className="bg-gray-50/60">
                          <td colSpan={4} className="px-5 py-4">
                            <div className="flex items-center gap-4">
                              {member.avatar_url ? (
                                <img
                                  src={member.avatar_url}
                                  alt={member.full_name}
                                  className="w-14 h-14 rounded-full object-cover border border-gray-200"
                                />
                              ) : (
                                <div className="w-14 h-14 rounded-full bg-gray-100 text-gray-700 text-lg font-bold flex items-center justify-center border border-gray-200">
                                  {member.full_name.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <div className="text-xs text-gray-600 space-y-1">
                                <p>
                                  <span className="font-medium text-gray-800">Job Title:</span>{" "}
                                  {member.job_title || "Not set"}
                                </p>
                                <p>
                                  <span className="font-medium text-gray-800">Phone:</span>{" "}
                                  {member.phone || "Not set"}
                                </p>
                                <p>
                                  <span className="font-medium text-gray-800">Joined:</span>{" "}
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

        <div className="mt-10 mb-10 max-w-md">
          <h2 className="text-lg font-medium mb-4">My Profile</h2>
          <form onSubmit={handleSaveProfile} className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Profile Photo</label>
              {myAvatarUrl && !avatarFile && (
                <img
                  src={myAvatarUrl}
                  alt="Current avatar"
                  className="w-16 h-16 rounded-full object-cover mb-2 border border-gray-200"
                />
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                required
                value={myFullName}
                onChange={(e) => setMyFullName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Job Title</label>
              <input
                type="text"
                value={myJobTitle}
                onChange={(e) => setMyJobTitle(e.target.value)}
                placeholder="e.g. Program Coordinator"
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                value={myPhone}
                onChange={(e) => setMyPhone(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="bg-black text-white px-6 py-2.5 rounded hover:opacity-90 disabled:opacity-50"
            >
              {savingProfile ? "Saving..." : "Save Profile"}
            </button>
            {profileError && <p className="text-red-600 text-sm">{profileError}</p>}
            {profileSuccess && <p className="text-green-700 text-sm">{profileSuccess}</p>}
          </form>
        </div>

        <div className="mt-10 mb-10 max-w-md">
          <h2 className="text-lg font-medium mb-4">Change My Password</h2>
          <form onSubmit={handleChangePassword} className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">New Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <button
              type="submit"
              disabled={changingPassword}
              className="bg-black text-white px-6 py-2.5 rounded hover:opacity-90 disabled:opacity-50"
            >
              {changingPassword ? "Updating..." : "Update Password"}
            </button>
            {passwordError && <p className="text-red-600 text-sm">{passwordError}</p>}
            {passwordSuccess && <p className="text-green-700 text-sm">{passwordSuccess}</p>}
          </form>
        </div>

        {/* Right Sidebar: Add Admin Form or Restricted Notice */}
        <div className="space-y-6">
          {currentUserRole === "super_admin" ? (
            <div className="bg-white rounded-[15px] border border-gray-200/80 p-5 shadow-xs space-y-4">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider pb-1 border-b border-gray-100">
                Add New Admin
              </h2>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-[12px] p-3 text-xs text-red-600 flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-[12px] p-3 text-xs text-emerald-700 flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{success}</span>
                </div>
              )}

              <form onSubmit={handleCreate} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all placeholder:text-gray-400"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all placeholder:text-gray-400"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Temporary Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2 text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all placeholder:text-gray-300"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    Share this with them directly — they can change it after logging in.
                  </p>
                </div>

                {/* Role */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  >
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={creating}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-medium text-xs px-5 py-2.5 rounded-full shadow-xs transition-colors disabled:opacity-50 mt-2"
                >
                  {creating ? (
                    <>
                      <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Add Admin Member</span>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-[15px] border border-gray-200/80 p-5 text-center">
              <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-xs font-semibold text-gray-700">Access Restricted</p>
              <p className="text-[11px] text-gray-400 mt-1">
                Only super admins can add or configure new team members.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}