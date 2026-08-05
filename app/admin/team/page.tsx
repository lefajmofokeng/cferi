"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type AdminUser = {
  id: string;
  full_name: string;
  role: string;
  created_at: string;
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

    const { data } = await supabase
      .from("admin_users")
      .select("id, full_name, role, created_at")
      .order("created_at", { ascending: true });

    setTeam(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadTeam();
  }, []);

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
    return <main className="px-8 py-8">Loading...</main>;
  }

  return (
    <main className="px-8 py-8 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">Team</h1>

      <table className="w-full text-sm border-collapse mb-10">
        <thead>
          <tr className="text-left border-b border-gray-200 text-gray-500">
            <th className="py-2 pr-4">Name</th>
            <th className="py-2 pr-4">Role</th>
            <th className="py-2 pr-4">Added</th>
          </tr>
        </thead>
        <tbody>
          {team.map((member) => (
            <tr key={member.id} className="border-b border-gray-100">
              <td className="py-3 pr-4">{member.full_name}</td>
              <td className="py-3 pr-4 capitalize">{member.role.replace("_", " ")}</td>
              <td className="py-3 pr-4 text-gray-500">
                {new Date(member.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {currentUserRole === "super_admin" ? (
        <>
          <h2 className="text-lg font-medium mb-4">Add New Admin</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Temporary Password</label>
              <input
                type="text"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Share this with them directly — they can change it after logging in.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={creating}
              className="bg-black text-white px-6 py-3 rounded hover:opacity-90 disabled:opacity-50"
            >
              {creating ? "Creating..." : "Add Admin"}
            </button>

            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-green-700 text-sm">{success}</p>}
          </form>
        </>
      ) : (
        <p className="text-gray-500 text-sm">
          Only super admins can add new team members.
        </p>
      )}
    </main>
  );
}