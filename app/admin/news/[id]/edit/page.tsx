"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import Link from "next/link";
import "./editNews.css";

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
      <main className="g-form-console">
        <div className="g-form-console__loading">
          <svg className="g-form-console__spinner g-form-console__spinner--large" viewBox="0 0 24 24">
            <circle className="g-form-console__spinner-circle" cx="12" cy="12" r="10" />
            <path className="g-form-console__spinner-path" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Loading post...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="g-form-console">
      {/* Top Header & Navigation Breadcrumb */}
      <header className="g-form-console__header">
        <nav aria-label="Breadcrumb" className="g-form-console__breadcrumb">
          <Link href="/admin/news" className="g-form-console__breadcrumb-link">
            News
          </Link>
          <span className="g-form-console__breadcrumb-sep" aria-hidden="true">/</span>
          <span className="g-form-console__breadcrumb-active" aria-current="page">Edit Post</span>
        </nav>

        <div className="g-form-console__title-row">
          <h1 className="g-form-console__title">Edit News Post</h1>
          <div className="g-form-console__actions">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="g-form-console__btn-danger"
            >
              Delete Post
            </button>
            <Link href="/admin/news" className="g-form-console__btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              form="edit-news-form"
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
                <span>Save Changes</span>
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
      <form id="edit-news-form" onSubmit={handleSubmit} className="g-form-console__grid">
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
                URL Slug <span className="g-form-console__required">*</span>
              </label>
              <input
                id="article-slug"
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
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

          {/* Cover Image Upload & Preview */}
          <div className="g-form-console__card">
            <h2 className="g-form-console__card-title">Featured Media</h2>

            <div className="g-form-console__field">
              <label className="g-form-console__label">Cover Image</label>

              {coverImageUrl && !coverImage && (
                <div className="g-form-console__image-preview">
                  <img
                    src={coverImageUrl}
                    alt="Current cover"
                    className="g-form-console__image-img"
                  />
                  <span className="g-form-console__image-badge">
                    Current Image
                  </span>
                </div>
              )}

              <div className="g-form-console__upload-zone">
                <svg className="g-form-console__upload-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z" />
                </svg>
                <p className="g-form-console__upload-filename">
                  {coverImage ? coverImage.name : "Replace cover image"}
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