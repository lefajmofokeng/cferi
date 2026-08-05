"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function NewAnnouncementPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [status, setStatus] = useState("draft");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.from("announcements").insert({
      title,
      message,
      is_pinned: isPinned,
      status,
      published_at: status === "published" ? new Date().toISOString() : null,
    });

    if (error) {
      setError(error.message);
      setSaving(false);
    } else {
      router.push("/admin/announcements");
      router.refresh();
    }
  }

  return (
    <main className="px-8 py-8 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">New Announcement</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea
            required
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isPinned"
            checked={isPinned}
            onChange={(e) => setIsPinned(e.target.checked)}
          />
          <label htmlFor="isPinned" className="text-sm">
            Pin this announcement to the top
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-black text-white px-6 py-3 rounded hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Announcement"}
        </button>

        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>
    </main>
  );
}