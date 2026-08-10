"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import Link from "next/link";

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
    return (
      <main className="p-6 font-sans text-gray-800 max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-24 text-xs font-semibold text-gray-400 gap-2">
          <svg className="w-4 h-4 animate-spin text-gray-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Loading announcement...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 font-sans text-gray-800 max-w-7xl mx-auto space-y-6">
      {/* Top Header & Navigation Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-1">
            <Link href="/admin/announcements" className="hover:text-gray-800 transition-colors">
              Announcements
            </Link>
            <span>/</span>
            <span className="text-gray-800">Edit Announcement</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Edit Announcement
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 rounded-full border border-red-200/80 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
          >
            Delete Announcement
          </button>
          <Link
            href="/admin/announcements"
            className="px-4 py-2 rounded-full border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            form="edit-announcement-form"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-medium text-xs px-5 py-2.5 rounded-full shadow-xs transition-colors disabled:opacity-50"
          >
            {saving ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-[12px] p-4 text-xs text-red-600 flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Main Form Layout Grid */}
      <form id="edit-announcement-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Announcement Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[15px] border border-gray-200/80 p-5 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider pb-1 border-b border-gray-100">
              Announcement Content
            </h2>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Scheduled System Maintenance"
                className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Message Body */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={8}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your announcement details here..."
                className="w-full bg-white border border-gray-200 rounded-lg p-3.5 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all placeholder:text-gray-400 resize-y"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Settings & Visibility */}
        <div className="space-y-6">
          <div className="bg-white rounded-[15px] border border-gray-200/80 p-5 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider pb-1 border-b border-gray-100">
              Publishing & Visibility
            </h2>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            {/* Pin Option */}
            <div className="pt-2">
              <label
                htmlFor="isPinned"
                className="flex items-start gap-3 p-3 rounded-lg border border-gray-200/80 bg-gray-50/50 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  id="isPinned"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                />
                <div className="text-xs">
                  <span className="font-semibold text-gray-800 block">
                    Pin Announcement
                  </span>
                  <span className="text-gray-500 font-normal">
                    Keep this item fixed at the top of the announcements list.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>
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