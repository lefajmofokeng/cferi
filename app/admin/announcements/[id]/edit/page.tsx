"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

export default function EditAnnouncementPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [status, setStatus] = useState("draft");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    async function loadAnnouncement() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("announcements")
        .select("title, message, is_pinned, status")
        .eq("id", params.id)
        .single();

      if (error) {
        setError(error.message);
      } else if (data) {
        setTitle(data.title);
        setMessage(data.message);
        setIsPinned(data.is_pinned);
        setStatus(data.status);
      }
      setLoading(false);
    }
    loadAnnouncement();
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase
      .from("announcements")
      .update({
        title,
        message,
        is_pinned: isPinned,
        status,
        published_at: status === "published" ? new Date().toISOString() : null,
      })
      .eq("id", params.id);

    if (error) {
      setError(error.message);
      setSaving(false);
    } else {
      router.push("/admin/announcements");
      router.refresh();
    }
  }

  async function handleDelete() {
    const supabase = createClient();
    const { error } = await supabase.from("announcements").delete().eq("id", params.id);

    if (error) {
      setError(error.message);
    } else {
      router.push("/admin/announcements");
      router.refresh();
    }
  }

  if (loading) {
    return <main className="px-8 py-8">Loading...</main>;
  }

  return (
    <main className="px-8 py-8 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">Edit Announcement</h1>

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

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-black text-white px-6 py-3 rounded hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="text-red-600 px-6 py-3 rounded border border-red-200 hover:bg-red-50"
          >
            Delete Announcement
          </button>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>

      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete this announcement?"
        description="This can't be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </main>
  );
}