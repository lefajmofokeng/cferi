import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

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
    </main>
  );
}