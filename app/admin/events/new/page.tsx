"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import "./newEvents.css";

export default function NewEventPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
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

    const { error } = await supabase.from("events").insert({
      title,
      slug: slug || slugify(title),
      description,
      location,
      starts_at: startsAt ? new Date(startsAt).toISOString() : null,
      ends_at: endsAt ? new Date(endsAt).toISOString() : null,
      status,
      cover_image_url: coverImageUrl,
    });

    if (error) {
      setError(error.message);
      setSaving(false);
    } else {
      router.push("/admin/events");
      router.refresh();
    }
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
          <span className="g-console__breadcrumb-active" aria-current="page">New Event</span>
        </nav>
        <div className="g-console__title-row">
          <h1 className="g-console__title">Create Event</h1>
          <div className="g-console__actions">
            <Link href="/admin/events" className="g-console__btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              form="event-form"
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
                <span>Save Event</span>
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
      <form id="event-form" onSubmit={handleSubmit} className="g-console__grid">
        {/* Left Column: Event Body & Primary Details */}
        <div className="g-console__col-main">
          <div className="g-console__card">
            <h2 className="g-console__card-title">Event Details</h2>

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
                placeholder="e.g., Annual Tech Hackathon 2026"
                className="g-console__input"
              />
            </div>

            <div className="g-console__form-group">
              <label htmlFor="event-slug" className="g-console__label">
                URL Slug
              </label>
              <input
                id="event-slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder={title ? slugify(title) : "auto-generated-slug"}
                className="g-console__input g-console__input--code"
              />
              <p className="g-console__hint">
                Leave blank to automatically derive from the event title.
              </p>
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

        {/* Right Column: Event Logistics, Schedule & Media */}
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
              <div className="g-console__upload-zone">
                <svg className="g-console__upload-icon" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z" />
                </svg>
                <p className="g-console__upload-name">
                  {coverImage ? coverImage.name : "Select an image file"}
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
    </main>
  );
}