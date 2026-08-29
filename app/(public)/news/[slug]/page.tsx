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

  const { data: post } = await supabase
    .from("news_posts")
    .select("title, excerpt, cover_image_url")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.cover_image_url ? [post.cover_image_url] : [],
    },
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post, error } = await supabase
    .from("news_posts")
    .select("title, content, published_at, cover_image_url")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !post) {
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
      {/* NEWS CONTENT CONTAINER */}
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
        {/* TITLE & METADATA (DATE) */}
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
            {post.title}
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
            {post.published_at && (
              <span>
                {new Date(post.published_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
          </div>
        </div>

        {/* COVER IMAGE */}
        {post.cover_image_url && (
          <div style={{ width: "100%", overflow: "hidden" }}>
            <img
              src={post.cover_image_url}
              alt={post.title}
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

        {/* NEWS BODY CONTENT */}
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
            {post.content}
          </div>
        </article>

        {/* SHARE BUTTONS */}
        <div style={{ paddingTop: "1rem" }}>
          <ShareButtons
            url={`${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/news/${slug}`}
            title={post.title}
          />
        </div>
      </main>
    </div>
  );
}