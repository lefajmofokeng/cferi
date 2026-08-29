import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ShareButtons from "@/components/public/ShareButtons";
import MarkdownContent from "@/components/public/MarkdownContent";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: paper } = await supabase
    .from("research_papers")
    .select(
      "title, author, description, content, cover_image_url, category, published_at",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!paper) return {};

  return {
    title: paper.title,
    description: paper.description ?? undefined,
    openGraph: {
      title: paper.title,
      description: paper.description ?? undefined,
      images: paper.cover_image_url ? [paper.cover_image_url] : [],
    },
  };
}

export default async function ResearchPaperDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: paper, error } = await supabase
    .from("research_papers")
    .select(
      "title, author, content, cover_image_url, published_at, category",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !paper) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-semibold mb-2">{paper.title}</h1>
      <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
        <span>By {paper.author}</span>
        {paper.published_at && (
          <>
            <span>·</span>
            <span>
              {new Date(paper.published_at).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </span>
          </>
        )}
        {paper.category && (
          <>
            <span>·</span>
            <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">
              {paper.category}
            </span>
          </>
        )}
      </div>

      {paper.cover_image_url && (
        <img
          src={paper.cover_image_url}
          alt={paper.title}
          className="w-full max-h-96 object-cover rounded mb-6"
        />
      )}

      <MarkdownContent content={paper.content} />

      <div className="mt-8 pt-6 border-t border-gray-200">
        <ShareButtons
          url={`${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/research-papers/${slug}`}
          title={paper.title}
        />
      </div>
    </main>
  );
}