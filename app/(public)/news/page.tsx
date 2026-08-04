import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function NewsPage() {
  const supabase = await createClient();

  const { data: posts, error } = await supabase
    .from("news_posts")
    .select("id, title, slug, excerpt, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-red-600">Failed to load news: {error.message}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-semibold mb-8">News</h1>

      {posts.length === 0 ? (
        <p className="text-gray-500">No news posts yet.</p>
      ) : (
        <ul className="space-y-6">
          {posts.map((post) => (
            <li key={post.id} className="border-b border-gray-200 pb-6">
              <Link href={`/news/${post.slug}`} className="text-xl font-medium hover:underline">
                {post.title}
              </Link>
              {post.excerpt && (
                <p className="text-gray-600 mt-1">{post.excerpt}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}