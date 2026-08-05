import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

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
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-semibold mb-2">{article.title}</h1>

      <p className="text-sm text-gray-500 mb-6">
        By {article.author}
        {article.published_at &&
          ` — ${new Date(article.published_at).toLocaleDateString()}`}
      </p>

      {article.cover_image_url && (
        <img
          src={article.cover_image_url}
          alt={article.title}
          className="w-full max-h-96 object-cover rounded mb-6"
        />
      )}

      <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
        {article.content}
      </div>
    </main>
  );
}