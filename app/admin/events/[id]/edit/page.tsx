"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import Link from "next/link";
import "./editEvents.css";

// Converts a stored UTC timestamp into the local value the
// datetime-local input needs (it doesn't understand "Z"/offsets).
function toLocalInputValue(isoString: string | null) {
  if (!isoString) return "";
  const date = new Date(isoString);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [status, setStatus] = useState("draft");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvent() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("events")
        .select("title, slug, description, location, starts_at, ends_at, status, cover_image_url")
        .eq("id", params.id)
        .single();

      if (error) {
        setError(error.message);
      } else if (data) {
        setTitle(data.title);
        setSlug(data.slug);
        setDescription(data.description);
        setLocation(data.location ?? "");
        setStartsAt(toLocalInputValue(data.starts_at));
        setEndsAt(toLocalInputValue(data.ends_at));
        setStatus(data.status);
        setCoverImageUrl(data.cover_image_url);
      }
      setLoading(false);
    }
    loadEvent();
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
      .from("events")
      .update({
        title,
        slug,
        description,
        location,
        starts_at: startsAt ? new Date(startsAt).toISOString() : null,
        ends_at: endsAt ? new Date(endsAt).toISOString() : null,
        status,
        cover_image_url: finalCoverImageUrl,
      })
      .eq("id", params.id);

    if (error) {
      setError(error.message);
      setSaving(false);
    } else {
      router.push("/admin/events");
      router.refresh();
    }
  }

  async function handleDelete() {
    const supabase = createClient();
    const { error } = await supabase.from("events").delete().eq("id", params.id);

    if (error) {
      setError(error.message);
    } else {
      router.push("/admin/events");
      router.refresh();
    }
  }

  if (loading) {
    return (
      <main className="g-console">
        <div className="g-console__loading">
          <svg className="g-console__spinner g-console__spinner--lg" viewBox="0 0 24 24" fill="none">
            <circle className="g-console__spinner-bg" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="g-console__spinner-fg" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Loading event...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="g-console">


      {/* Top Header & Navigation Breadcrumb */}
      <header className="g-console__header">
        <nav aria-label="Breadcrumb" className="g-console__breadcrumb">
          <Link href="/admin/events" className="g-console__breadcrumb-link">
            Events
          </Link>
          <span className="g-console__breadcrumb-sep" aria-hidden="true">/</span>
          <span className="g-console__breadcrumb-active" aria-current="page">Edit Event</span>
        </nav>
        <div className="g-console__title-row">
          <h1 className="g-console__title">Edit Event</h1>
          <div className="g-console__actions">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="g-console__btn-danger"
            >
              Delete Event
            </button>
            <Link href="/admin/events" className="g-console__btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              form="edit-event-form"
              disabled={saving}
              className="g-console__btn-primary"
            >
              {saving ? (
                <>
                  <svg className="g-console__spinner" viewBox="0 0 24 24" fill="none">
                    <circle className="g-console__spinner-bg" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="g-console__spinner-fg" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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
        <div className="g-console__error" role="alert">
          <svg className="g-console__error-icon" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Main Form Layout Grid */}
      <form id="edit-event-form" onSubmit={handleSubmit} className="g-console__grid">
        {/* Left Column: Primary Information */}
        <div className="g-console__col-main">
          <div className="g-console__card">
            <h2 className="g-console__card-title">Event Information</h2>

            <div className="g-console__form-group">
              <label htmlFor="event-title" className="g-console__label">
                Event Title <span className="g-console__req">*</span>
              </label>
              <input
                id="event-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Annual Tech Summit"
                className="g-console__input"
              />
            </div>

            <div className="g-console__form-group">
              <label htmlFor="event-slug" className="g-console__label">
                URL Slug <span className="g-console__req">*</span>
              </label>
              <input
                id="event-slug"
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="g-console__input g-console__input--code"
              />
            </div>

            <div className="g-console__form-group">
              <label htmlFor="event-description" className="g-console__label">
                Event Description <span className="g-console__req">*</span>
              </label>
              <textarea
                id="event-description"
                required
                rows={8}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide event details, schedule, agenda, or guidelines..."
                className="g-console__textarea"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Schedule, Location & Cover Image */}
        <div className="g-console__col-side">
          <div className="g-console__card">
            <h2 className="g-console__card-title">Schedule & Status</h2>

            <div className="g-console__form-group">
              <label htmlFor="event-status" className="g-console__label">
                Publishing Status
              </label>
              <select
                id="event-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="g-console__select"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="g-console__form-group">
              <label htmlFor="event-location" className="g-console__label">
                Location / Venue
              </label>
              <input
                id="event-location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Main Auditorium or Online"
                className="g-console__input"
              />
            </div>

            <div className="g-console__form-group">
              <label htmlFor="event-starts-at" className="g-console__label">
                Starts At <span className="g-console__req">*</span>
              </label>
              <input
                id="event-starts-at"
                type="datetime-local"
                required
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                className="g-console__input"
              />
            </div>

            <div className="g-console__form-group">
              <label htmlFor="event-ends-at" className="g-console__label">
                Ends At (optional)
              </label>
              <input
                id="event-ends-at"
                type="datetime-local"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                className="g-console__input"
              />
            </div>
          </div>

          <div className="g-console__card">
            <h2 className="g-console__card-title">Featured Media</h2>

            <div className="g-console__form-group">
              <label className="g-console__label">Cover Image</label>

              {coverImageUrl && !coverImage && (
                <div className="g-console__preview-container">
                  <img
                    src={coverImageUrl}
                    alt="Current cover"
                    className="g-console__preview-img"
                  />
                  <div className="g-console__preview-badge">Current Image</div>
                </div>
              )}

              <div className="g-console__upload-zone">
                <svg className="g-console__upload-icon" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z" />
                </svg>
                <p className="g-console__upload-name">
                  {coverImage ? coverImage.name : "Replace cover image"}
                </p>
                <p className="g-console__upload-sub">Supported formats: JPG, PNG, WEBP</p>
                <label className="g-console__btn-file">
                  <span>Browse File</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => setCoverImage(e.target.files?.[0] ?? null)}
                    className="g-console__file-input"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </form>

      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete this event?"
        description="This can't be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </main>
  );
}