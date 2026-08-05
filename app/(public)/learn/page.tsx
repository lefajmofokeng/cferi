import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function LearnPage() {
  const supabase = await createClient();

  const { data: articles, error } = await supabase
    .from("learn_articles")
    .select("id, title, slug, description, cover_image_url, author, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-red-600">Failed to load articles: {error.message}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-semibold mb-8">Learn</h1>

      {articles.length === 0 ? (
        <p className="text-gray-500">No articles yet.</p>
      ) : (
        <ul className="space-y-6">
          {articles.map((article) => (
            <li key={article.id} className="border-b border-gray-200 pb-6">
              {article.cover_image_url && (
                <img
                  src={article.cover_image_url}
                  alt={article.title}
                  className="w-full h-48 object-cover rounded mb-3"
                />
              )}
              <Link href={`/learn/${article.slug}`} className="text-xl font-medium hover:underline">
                {article.title}
              </Link>
              {article.description && (
                <p className="text-gray-600 mt-1">{article.description}</p>
              )}
              <p className="text-sm text-gray-400 mt-1">
                By {article.author}
                {article.published_at &&
                  ` — ${new Date(article.published_at).toLocaleDateString()}`}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}