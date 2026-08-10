"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function NewLearnArticlePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [status, setStatus] = useState("draft");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function slugify(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const supabase = createClient();
    let coverImageUrl: string | null = null;

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
      coverImageUrl = publicUrlData.publicUrl;
    }

    const { error } = await supabase.from("learn_articles").insert({
      title,
      slug: slug || slugify(title),
      description,
      author,
      content,
      cover_image_url: coverImageUrl,
      status,
      published_at: status === "published" ? new Date().toISOString() : null,
    });

    if (error) {
      setError(error.message);
      setSaving(false);
    } else {
      router.push("/admin/learn");
      router.refresh();
    }
  }

  return (
    <main className="p-6 font-sans text-gray-800 max-w-7xl mx-auto space-y-6">
      {/* Top Header & Navigation Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-1">
            <Link href="/admin/learn" className="hover:text-gray-800 transition-colors">
              Learn
            </Link>
            <span>/</span>
            <span className="text-gray-800">New Article</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Create Learn Article
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/learn"
            className="px-4 py-2 rounded-full border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            form="article-form"
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
              <span>Save Article</span>
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
      <form id="article-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Article Body & Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[15px] border border-gray-200/80 p-5 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider pb-1 border-b border-gray-100">
              Article Content
            </h2>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Article Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Getting Started with Web Development"
                className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                URL Slug
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder={title ? slugify(title) : "auto-generated-slug"}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2 text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all placeholder:text-gray-300"
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                Leave blank to automatically derive from the article title.
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Short Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of the article content..."
                className="w-full bg-white border border-gray-200 rounded-lg p-3.5 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all placeholder:text-gray-400 resize-y"
              />
            </div>

            {/* Content Body */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Full Content <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={12}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your article content here..."
                className="w-full bg-white border border-gray-200 rounded-lg p-3.5 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all placeholder:text-gray-400 resize-y"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Article Metadata & File Upload */}
        <div className="space-y-6">
          {/* Status & Author Settings */}
          <div className="bg-white rounded-[15px] border border-gray-200/80 p-5 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider pb-1 border-b border-gray-100">
              Publishing Settings
            </h2>

            {/* Status Selector */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Publishing Status
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

            {/* Author */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Author Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g., John Doe"
                className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Cover Image Upload Box */}
          <div className="bg-white rounded-[15px] border border-gray-200/80 p-5 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider pb-1 border-b border-gray-100">
              Featured Media
            </h2>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Cover Image
              </label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:bg-gray-50/50 transition-colors">
                <svg className="w-8 h-8 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-[11px] font-medium text-gray-600 mb-1">
                  {coverImage ? coverImage.name : "Select an image file"}
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
    </main>
  );
}