import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import ShareButtons from "@/components/public/ShareButtons";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: article } = await supabase
    .from("learn_articles")
    .select("title, description, cover_image_url")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!article) return {};

  return {
    title: article.title,
    description: article.description ?? undefined,
    openGraph: {
      title: article.title,
      description: article.description ?? undefined,
      images: article.cover_image_url ? [article.cover_image_url] : [],
    },
  };
}

export default async function LearnDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: article, error } = await supabase
    .from("learn_articles")
    .select("title, content, author, cover_image_url, published_at")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !article) {
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
      {/* HEADER / BREADCRUMB BAR */}
      <header style={{ padding: "1.5rem 0" }}>
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            href="/learn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "#64748b",
              textDecoration: "none",
            }}
          >
            <svg
              style={{ width: "1rem", height: "1rem" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Back to Learn</span>
          </Link>
        </div>
      </header>

      {/* ARTICLE CONTENT CONTAINER */}
      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "2rem 1.5rem 4rem",
          display: "flex",
          flexDirection: "column",
          gap: "2.5rem",
        }}
      >
        {/* TITLE & METADATA (DATE / AUTHOR) */}
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
            {article.title}
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
            {article.published_at && (
              <span>
                {new Date(article.published_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
            <span style={{ color: "#cbd5e1" }}>/</span>
            <span>{article.author || "Editorial Team"}</span>
          </div>
        </div>

        {/* COVER IMAGE */}
        {article.cover_image_url && (
          <div style={{ width: "100%", overflow: "hidden" }}>
            <img
              src={article.cover_image_url}
              alt={article.title}
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

        {/* ARTICLE BODY CONTENT */}
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
            {article.content}
          </div>
        </article>

        {/* SHARE BUTTONS */}
        <div style={{ paddingTop: "1rem" }}>
          <ShareButtons
            url={`${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/learn/${slug}`}
            title={article.title}
          />
        </div>
      </main>
    </div>
  );
}