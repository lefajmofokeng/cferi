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

  const { data: caseStudy } = await supabase
    .from("case_studies")
    .select("title, description, cover_image_url")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!caseStudy) return {};

  return {
    title: caseStudy.title,
    description: caseStudy.description ?? undefined,
    openGraph: {
      title: caseStudy.title,
      description: caseStudy.description ?? undefined,
      images: caseStudy.cover_image_url ? [caseStudy.cover_image_url] : [],
    },
  };
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: caseStudy, error } = await supabase
    .from("case_studies")
    .select("title, client_name, industry, outcomes, content, cover_image_url")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !caseStudy) {
    notFound();
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        color: "#0f172a",
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        backgroundColor: "#ffffff",
      }}
    >
      {/* CASE STUDY CONTENT CONTAINER */}
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
        {/* TITLE & METADATA (CLIENT / INDUSTRY) */}
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
            {caseStudy.title}
          </h1>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.875rem",
              color: "#64748b",
            }}
          >
            {caseStudy.client_name && <span>{caseStudy.client_name}</span>}
            {caseStudy.client_name && caseStudy.industry && (
              <span style={{ color: "#cbd5e1" }}>/</span>
            )}
            {caseStudy.industry && <span>{caseStudy.industry}</span>}
          </div>
        </div>

        {/* COVER IMAGE */}
        {caseStudy.cover_image_url && (
          <div style={{ width: "100%", overflow: "hidden" }}>
            <img
              src={caseStudy.cover_image_url}
              alt={caseStudy.title}
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

        {/* CASE STUDY BODY CONTENT */}
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
            {caseStudy.content}
          </div>
        </article>

        {/* OUTCOMES SECTION */}
        {caseStudy.outcomes && (
          <div style={{ width: "100%", paddingTop: "1rem" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 600,
                color: "#0f172a",
                marginBottom: "0.75rem",
              }}
            >
              Outcomes
            </h2>
            <p
              style={{
                color: "#334155",
                fontSize: "1.125rem",
                lineHeight: 1.75,
                whiteSpace: "pre-wrap",
                margin: 0,
              }}
            >
              {caseStudy.outcomes}
            </p>
          </div>
        )}

        {/* SHARE BUTTONS */}
        <div style={{ paddingTop: "1rem" }}>
          <ShareButtons
            url={`${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/case-studies/${slug}`}
            title={caseStudy.title}
          />
        </div>
      </main>
    </div>
  );
}