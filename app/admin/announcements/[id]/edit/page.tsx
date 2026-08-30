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
      <main className="g-form-console">
        <style>{cssStyles}</style>
        <div className="g-form-console__loading">
          <svg className="g-form-console__spinner g-form-console__spinner--large" viewBox="0 0 24 24">
            <circle className="g-form-console__spinner-circle" cx="12" cy="12" r="10" />
            <path className="g-form-console__spinner-path" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Loading announcement...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="g-form-console">
      <style>{cssStyles}</style>

      {/* Top Header & Navigation Breadcrumb */}
      <header className="g-form-console__header">
        <nav aria-label="Breadcrumb" className="g-form-console__breadcrumb">
          <Link href="/admin/announcements" className="g-form-console__breadcrumb-link">
            Announcements
          </Link>
          <span className="g-form-console__breadcrumb-sep" aria-hidden="true">/</span>
          <span className="g-form-console__breadcrumb-active" aria-current="page">Edit Announcement</span>
        </nav>

        <div className="g-form-console__title-row">
          <h1 className="g-form-console__title">Edit Announcement</h1>
          <div className="g-form-console__actions">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="g-form-console__btn-danger"
            >
              Delete Announcement
            </button>
            <Link href="/admin/announcements" className="g-form-console__btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              form="edit-announcement-form"
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
      <form id="edit-announcement-form" onSubmit={handleSubmit} className="g-form-console__grid">
        {/* Left Column: Announcement Content */}
        <div className="g-form-console__col-main">
          <div className="g-form-console__card">
            <h2 className="g-form-console__card-title">Announcement Content</h2>

            {/* Title */}
            <div className="g-form-console__field">
              <label htmlFor="announcement-title" className="g-form-console__label">
                Title <span className="g-form-console__required">*</span>
              </label>
              <input
                id="announcement-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Scheduled System Maintenance"
                className="g-form-console__input"
              />
            </div>

            {/* Message Body */}
            <div className="g-form-console__field">
              <label htmlFor="announcement-message" className="g-form-console__label">
                Message <span className="g-form-console__required">*</span>
              </label>
              <textarea
                id="announcement-message"
                required
                rows={8}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your announcement details here..."
                className="g-form-console__textarea g-form-console__textarea--large"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Settings & Visibility */}
        <div className="g-form-console__col-side">
          <div className="g-form-console__card">
            <h2 className="g-form-console__card-title">Publishing & Visibility</h2>

            {/* Status */}
            <div className="g-form-console__field">
              <label htmlFor="announcement-status" className="g-form-console__label">
                Status
              </label>
              <select
                id="announcement-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="g-form-console__select"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            {/* Pin Option */}
            <div className="g-form-console__field">
              <label htmlFor="isPinned" className="g-form-console__checkbox-card">
                <input
                  type="checkbox"
                  id="isPinned"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="g-form-console__checkbox"
                />
                <div className="g-form-console__checkbox-text">
                  <span className="g-form-console__checkbox-label">
                    Pin Announcement
                  </span>
                  <span className="g-form-console__checkbox-desc">
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

const cssStyles = `
  /* Google Admin Console Design System Edit Form Styles */
  .g-form-console {
    max-width: 1120px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
    font-family: "Google Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #1f1f1f;
    background-color: #f8f9fa;
    min-height: 100vh;
    box-sizing: border-box;
  }

  .g-form-console *,
  .g-form-console *::before,
  .g-form-console *::after {
    box-sizing: inherit;
  }

  /* Loading State */
  .g-form-console__loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 6rem 0;
    font-size: 0.8125rem;
    font-weight: 500;
    color: #5f6368;
  }

  /* Header & Navigation */
  .g-form-console__header {
    margin-bottom: 1.5rem;
  }

  .g-form-console__breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: #5f6368;
    margin-bottom: 0.5rem;
  }

  .g-form-console__breadcrumb-link {
    color: #5f6368;
    text-decoration: none;
    transition: color 0.15s ease;
  }

  .g-form-console__breadcrumb-link:hover {
    color: #1a73e8;
  }

  .g-form-console__breadcrumb-sep {
    color: #dadce0;
  }

  .g-form-console__breadcrumb-active {
    color: #1a73e8;
  }

  .g-form-console__title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .g-form-console__title {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 400;
    color: #202124;
    letter-spacing: -0.01em;
  }

  .g-form-console__actions {
    display: flex;
    align-items: center;
    gap: 0.625rem;
  }

  /* Action Buttons */
  .g-form-console__btn-danger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1.25rem;
    border-radius: 9999px;
    border: 1px solid #f2b8b5;
    background-color: #ffffff;
    color: #c5221f;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.15s ease, border-color 0.15s ease;
  }

  .g-form-console__btn-danger:hover {
    background-color: #fce8e6;
    border-color: #f2b8b5;
  }

  .g-form-console__btn-secondary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1.25rem;
    border-radius: 9999px;
    border: 1px solid #dadce0;
    background-color: #ffffff;
    color: #1a73e8;
    font-size: 0.875rem;
    font-weight: 500;
    text-decoration: none;
    transition: background-color 0.15s ease, border-color 0.15s ease;
  }

  .g-form-console__btn-secondary:hover {
    background-color: #f1f3f4;
    border-color: #d2e3fc;
  }

  .g-form-console__btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem 1.25rem;
    border-radius: 9999px;
    border: none;
    background-color: #1a73e8;
    color: #ffffff;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15);
    transition: background-color 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
  }

  .g-form-console__btn-primary:hover:not(:disabled) {
    background-color: #1765cc;
    box-shadow: 0 1px 3px 0 rgba(60, 64, 67, 0.3), 0 4px 8px 3px rgba(60, 64, 67, 0.15);
  }

  .g-form-console__btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Spinner Animations */
  .g-form-console__spinner {
    width: 0.875rem;
    height: 0.875rem;
    animation: g-spin 1s linear infinite;
  }

  .g-form-console__spinner--large {
    width: 1.25rem;
    height: 1.25rem;
    color: #1a73e8;
  }

  .g-form-console__spinner-circle {
    opacity: 0.25;
    fill: none;
    stroke: currentColor;
    stroke-width: 4;
  }

  .g-form-console__spinner-path {
    opacity: 0.75;
    fill: currentColor;
  }

  @keyframes g-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* Error Banner */
  .g-form-console__error {
    background-color: #fce8e6;
    border: 1px solid #f2b8b5;
    color: #c5221f;
    padding: 1rem;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8125rem;
    margin-bottom: 1.5rem;
  }

  .g-form-console__error-icon {
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
  }

  /* Form Grid */
  .g-form-console__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  @media (min-width: 1024px) {
    .g-form-console__grid {
      grid-template-columns: 2fr 1fr;
    }
  }

  .g-form-console__col-main,
  .g-form-console__col-side {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  /* Surface Cards */
  .g-form-console__card {
    background-color: #ffffff;
    border: 1px solid #dadce0;
    border-radius: 1rem;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .g-form-console__card-title {
    margin: 0;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #f1f3f4;
    font-size: 0.75rem;
    font-weight: 700;
    color: #5f6368;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* Form Fields */
  .g-form-console__field {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  .g-form-console__label {
    font-size: 0.8125rem;
    font-weight: 500;
    color: #202124;
  }

  .g-form-console__required {
    color: #d93025;
  }

  .g-form-console__input,
  .g-form-console__textarea,
  .g-form-console__select {
    width: 100%;
    background-color: #ffffff;
    border: 1px solid #dadce0;
    border-radius: 0.5rem;
    padding: 0.625rem 0.875rem;
    font-size: 0.8125rem;
    font-family: inherit;
    color: #202124;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }

  .g-form-console__input:focus,
  .g-form-console__textarea:focus,
  .g-form-console__select:focus {
    outline: none;
    border-color: #1a73e8;
    box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2);
  }

  .g-form-console__input::placeholder,
  .g-form-console__textarea::placeholder {
    color: #80868b;
  }

  .g-form-console__textarea {
    resize: vertical;
  }

  .g-form-console__textarea--large {
    min-height: 180px;
  }

  /* Custom Checkbox Card Component */
  .g-form-console__checkbox-card {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.875rem 1rem;
    border-radius: 0.5rem;
    border: 1px solid #dadce0;
    background-color: #f8f9fa;
    cursor: pointer;
    transition: background-color 0.15s ease, border-color 0.15s ease;
  }

  .g-form-console__checkbox-card:hover {
    background-color: #f1f3f4;
    border-color: #bdc1c6;
  }

  .g-form-console__checkbox {
    margin-top: 0.125rem;
    width: 1rem;
    height: 1rem;
    accent-color: #1a73e8;
    cursor: pointer;
  }

  .g-form-console__checkbox-text {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .g-form-console__checkbox-label {
    font-size: 0.8125rem;
    font-weight: 500;
    color: #202124;
  }

  .g-form-console__checkbox-desc {
    font-size: 0.75rem;
    color: #5f6368;
    line-height: 1.3;
  }
`;