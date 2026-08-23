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
    <main className="mx-auto w-full max-w-[1200px] px-6 py-12">
      <h1 className="text-3xl font-semibold mb-2">{post.title}</h1>
      {post.cover_image_url && (
        <img
          src={post.cover_image_url}
          alt={post.title}
          className="w-full max-h-150 object-cover rounded mb-6"
        />
      )}
      {post.published_at && (
        <p className="text-sm text-gray-500 mb-8">
          {new Date(post.published_at).toLocaleDateString()}
        </p>
      )}
      <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
        {post.content}
      </div>
      <div className="mt-8 pt-6 border-t border-gray-200">
  <ShareButtons
    url={`${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/news/${slug}`}
    title={post.title}
  />
</div>
    </main>
  );
}