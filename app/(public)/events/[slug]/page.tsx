import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ShareButtons from "@/components/public/ShareButtons";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select("title, description, cover_image_url")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!event) return {};

  return {
    title: event.title,
    description: event.description?.slice(0, 160),
    openGraph: {
      title: event.title,
      description: event.description?.slice(0, 160),
      images: event.cover_image_url ? [event.cover_image_url] : [],
    },
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: event, error } = await supabase
    .from("events")
    .select("title, description, location, starts_at, ends_at, cover_image_url")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !event) {
    notFound();
  }

  const formattedStartDate = event.starts_at
    ? new Date(event.starts_at).toLocaleString("en-US", {
        dateStyle: "full",
        timeStyle: "short",
      })
    : null;

  const formattedEndDate = event.ends_at
    ? new Date(event.ends_at).toLocaleString("en-US", {
        timeStyle: "short",
      })
    : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        color: "#0f172a",
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        backgroundColor: "#ffffff",
      }}
    >
      {/* MAIN CONTENT CONTAINER */}
      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "4rem 1.5rem 4rem",
          display: "flex",
          flexDirection: "column",
          gap: "2.5rem",
        }}
      >
        {/* TWO PANEL GRID LAYOUT */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "3rem",
            alignItems: "start",
          }}
        >
          {/* MAIN DETAILS PANEL */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2.5rem",
              gridColumn: "span 2",
            }}
          >
            {/* TITLE & QUICK METADATA */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <h1
                style={{
                  fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
                  lineHeight: 1.15,
                  fontWeight: 700,
                  letterSpacing: "-0.025em",
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                {event.title}
              </h1>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  fontSize: "0.875rem",
                  color: "#64748b",
                }}
              >
                {formattedStartDate && (
                  <span>
                    {formattedStartDate}
                    {formattedEndDate && ` – ${formattedEndDate}`}
                  </span>
                )}
                {formattedStartDate && event.location && (
                  <span style={{ color: "#cbd5e1" }}>/</span>
                )}
                {event.location && <span>{event.location}</span>}
              </div>
            </div>

            {/* COVER IMAGE */}
            {event.cover_image_url && (
              <div style={{ width: "100%", overflow: "hidden" }}>
                <img
                  src={event.cover_image_url}
                  alt={event.title}
                  style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "600px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
            )}

            {/* EVENT DESCRIPTION CONTENT */}
            <article style={{ width: "100%" }}>
              <div
                style={{
                  color: "#1e293b",
                  fontSize: "1.125rem",
                  lineHeight: 1.75,
                  fontWeight: 400,
                  whiteSpace: "pre-wrap",
                }}
              >
                {event.description}
              </div>
            </article>
          </div>

          {/* SIDE PANEL / EVENT SUMMARY */}
          <aside
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
              position: "sticky",
              top: "2rem",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "#94a3b8",
                }}
              >
                Date & Time
              </span>
              <p
                style={{
                  fontSize: "0.95rem",
                  color: "#334155",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {formattedStartDate ? (
                  <>
                    {formattedStartDate}
                    {formattedEndDate && ` – ${formattedEndDate}`}
                  </>
                ) : (
                  "TBA"
                )}
              </p>
            </div>

            {event.location && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "#94a3b8",
                  }}
                >
                  Location
                </span>
                <p
                  style={{
                    fontSize: "0.95rem",
                    color: "#334155",
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {event.location}
                </p>
              </div>
            )}
          </aside>
        </div>

        {/* SHARE BUTTONS */}
        <div style={{ paddingTop: "1rem" }}>
          <ShareButtons
            url={`${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/events/${slug}`}
            title={event.title}
          />
        </div>
      </main>
    </div>
  );
}