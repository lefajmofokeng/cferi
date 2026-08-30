"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import "./addNews.css";

export default function NewNewsPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("draft");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);

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

    const { error } = await supabase.from("news_posts").insert({
      title,
      slug: slug || slugify(title),
      excerpt,
      content,
      status,
      cover_image_url: coverImageUrl,
      published_at: status === "published" ? new Date().toISOString() : null,
    });

    if (error) {
      setError(error.message);
      setSaving(false);
    } else {
      router.push("/admin/news");
      router.refresh();
    }
  }

  return (
    <main className="g-form-console">
      {/* Top Header & Breadcrumb */}
      <header className="g-form-console__header">
        <nav aria-label="Breadcrumb" className="g-form-console__breadcrumb">
          <Link href="/admin/news" className="g-form-console__breadcrumb-link">
            News
          </Link>
          <span className="g-form-console__breadcrumb-sep" aria-hidden="true">/</span>
          <span className="g-form-console__breadcrumb-active" aria-current="page">New Post</span>
        </nav>

        <div className="g-form-console__title-row">
          <h1 className="g-form-console__title">Create News Post</h1>
          <div className="g-form-console__actions">
            <Link href="/admin/news" className="g-form-console__btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              form="new-news-form"
              disabled={saving}
              className="g-form-console__btn-primary"
            >
              {saving ? (
                <>
                  <svg className="g-form-console__spinner" viewBox="0 0 24 24">
                    <circle className="g-form-console__spinner-circle" cx="12" cy="12" r="10" />
                    <path className="g-form-console__spinner-path" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Post</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div className="g-form-console__error" role="alert">
          <svg className="g-form-console__error-icon" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Main Form Layout Grid */}
      <form id="new-news-form" onSubmit={handleSubmit} className="g-form-console__grid">
        {/* Left Column: Primary Content */}
        <div className="g-form-console__col-main">
          <div className="g-form-console__card">
            <h2 className="g-form-console__card-title">Article Content</h2>

            {/* Title */}
            <div className="g-form-console__field">
              <label htmlFor="article-title" className="g-form-console__label">
                Title <span className="g-form-console__required">*</span>
              </label>
              <input
                id="article-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., New Platform Features Announced"
                className="g-form-console__input"
              />
            </div>

            {/* Slug */}
            <div className="g-form-console__field">
              <label htmlFor="article-slug" className="g-form-console__label">
                URL Slug <span className="g-form-console__hint">(leave blank to auto-generate)</span>
              </label>
              <input
                id="article-slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder={title ? slugify(title) : "e.g., new-platform-features"}
                className="g-form-console__input g-form-console__input--code"
              />
            </div>

            {/* Excerpt */}
            <div className="g-form-console__field">
              <label htmlFor="article-excerpt" className="g-form-console__label">
                Excerpt
              </label>
              <textarea
                id="article-excerpt"
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A short summary of the news article for previews and cards..."
                className="g-form-console__textarea"
              />
            </div>

            {/* Main Content */}
            <div className="g-form-console__field">
              <label htmlFor="article-content" className="g-form-console__label">
                Full Content <span className="g-form-console__required">*</span>
              </label>
              <textarea
                id="article-content"
                required
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your article body here..."
                className="g-form-console__textarea g-form-console__textarea--large"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Settings & Media */}
        <div className="g-form-console__col-side">
          {/* Publishing Settings */}
          <div className="g-form-console__card">
            <h2 className="g-form-console__card-title">Publishing Options</h2>

            <div className="g-form-console__field">
              <label htmlFor="article-status" className="g-form-console__label">
                Status
              </label>
              <select
                id="article-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="g-form-console__select"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          {/* Cover Image Upload */}
          <div className="g-form-console__card">
            <h2 className="g-form-console__card-title">Featured Media</h2>

            <div className="g-form-console__field">
              <label className="g-form-console__label">
                Cover Image <span className="g-form-console__hint">(optional)</span>
              </label>

              <div className="g-form-console__upload-zone">
                <svg className="g-form-console__upload-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z" />
                </svg>
                <p className="g-form-console__upload-filename">
                  {coverImage ? coverImage.name : "Select cover image"}
                </p>
                <p className="g-form-console__upload-types">
                  Supported formats: JPG, PNG, WEBP
                </p>
                <label className="g-form-console__btn-file">
                  <span>Browse File</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => setCoverImage(e.target.files?.[0] ?? null)}
                    className="g-form-console__hidden-input"
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
