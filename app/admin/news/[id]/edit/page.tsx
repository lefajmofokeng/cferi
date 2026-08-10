"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import Link from "next/link";

export default function EditNewsPostPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("draft");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadPost() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("news_posts")
        .select("title, slug, excerpt, content, status, cover_image_url")
        .eq("id", params.id)
        .single();

      if (error) {
        setError(error.message);
      } else if (data) {
        setTitle(data.title);
        setSlug(data.slug);
        setExcerpt(data.excerpt ?? "");
        setContent(data.content);
        setStatus(data.status);
        setCoverImageUrl(data.cover_image_url);
      }
      setLoading(false);
    }
    loadPost();
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const supabase = createClient();
    let finalCoverImageUrl = coverImageUrl;

    if (coverImage) {
      const filePath = `${Date.now()}-${coverImage.name}`;
      const { error: uploadError } = await supabase.storage
        .from("cover-images")
        .upload(filePath, coverImage);

      if (uploadError) {
        setError(`Image upload failed: ${uploadError.message}`);
        setSaving(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("cover-images")
        .getPublicUrl(filePath);
      finalCoverImageUrl = publicUrlData.publicUrl;
    }

    const { error } = await supabase
      .from("news_posts")
      .update({
        title,
        slug,
        excerpt,
        content,
        status,
        cover_image_url: finalCoverImageUrl,
        published_at: status === "published" ? new Date().toISOString() : null,
      })
      .eq("id", params.id);

    if (error) {
      setError(error.message);
      setSaving(false);
    } else {
      router.push("/admin/news");
      router.refresh();
    }
  }

  async function handleDelete() {
    const supabase = createClient();
    const { error } = await supabase.from("news_posts").delete().eq("id", params.id);

    if (error) {
      setError(error.message);
    } else {
      router.push("/admin/news");
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
          <span>Loading post...</span>
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
            <Link href="/admin/news" className="hover:text-gray-800 transition-colors">
              News
            </Link>
            <span>/</span>
            <span className="text-gray-800">Edit Post</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Edit News Post
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 rounded-full border border-red-200/80 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
          >
            Delete Post
          </button>
          <Link
            href="/admin/news"
            className="px-4 py-2 rounded-full border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            form="edit-news-form"
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
      <form id="edit-news-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Primary Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[15px] border border-gray-200/80 p-5 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider pb-1 border-b border-gray-100">
              Article Content
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
                placeholder="e.g., New Platform Features Announced"
                className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                URL Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2 text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all placeholder:text-gray-300"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Excerpt
              </label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A short summary of the news article for previews and cards..."
                className="w-full bg-white border border-gray-200 rounded-lg p-3.5 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all placeholder:text-gray-400 resize-y"
              />
            </div>

            {/* Main Content */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Full Content <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your article body here..."
                className="w-full bg-white border border-gray-200 rounded-lg p-3.5 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all placeholder:text-gray-400 resize-y"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Settings & Media */}
        <div className="space-y-6">
          {/* Publishing Settings */}
          <div className="bg-white rounded-[15px] border border-gray-200/80 p-5 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider pb-1 border-b border-gray-100">
              Publishing Options
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
          </div>

          {/* Cover Image Upload & Preview */}
          <div className="bg-white rounded-[15px] border border-gray-200/80 p-5 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider pb-1 border-b border-gray-100">
              Featured Media
            </h2>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Cover Image
              </label>

              {coverImageUrl && !coverImage && (
                <div className="mb-3 relative rounded-lg overflow-hidden border border-gray-200/80 aspect-video bg-gray-50">
                  <img
                    src={coverImageUrl}
                    alt="Current cover"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-gray-900/80 text-white text-[10px] font-medium px-2 py-0.5 rounded-md backdrop-blur-xs">
                    Current Image
                  </div>
                </div>
              )}

              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:bg-gray-50/50 transition-colors">
                <svg className="w-7 h-7 mx-auto text-gray-300 mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-[11px] font-medium text-gray-600 mb-1">
                  {coverImage ? coverImage.name : "Replace cover image"}
                </p>
                <p className="text-[10px] text-gray-400 mb-3">
                  Supported formats: JPG, PNG, WEBP
                </p>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium cursor-pointer transition-colors">
                  <span>Browse File</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => setCoverImage(e.target.files?.[0] ?? null)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </form>

      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete this post?"
        description="This can't be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </main>
  );
}