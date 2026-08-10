import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function NewsPage() {
  const supabase = await createClient();

  const { data: posts, error } = await supabase
    .from("news_posts")
    .select("id, title, slug, excerpt, published_at, cover_image_url")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    return (
      <main className="mx-auto w-full max-w-[1200px] px-6 py-16">
        <p className="text-red-600">Failed to load news: {error.message}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1200px] px-6 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-10">News</h1>

      {posts.length === 0 ? (
        <p className="text-gray-500">No news posts yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post.id} href={`/news/${post.slug}`} className="group flex flex-col">
              {post.cover_image_url && (
                <div className="overflow-hidden rounded-xl mb-4 aspect-[16/10] bg-gray-100">
                  <img
                    src={post.cover_image_url}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}
              <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug mb-2">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow">
                  {post.excerpt}
                </p>
              )}
              <span className="text-blue-600 font-medium text-sm flex items-center gap-1 mt-auto group-hover:underline">
                Learn more →
              </span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}