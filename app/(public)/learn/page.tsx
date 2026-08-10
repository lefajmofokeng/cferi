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
      <main className="mx-auto w-full max-w-[1200px] px-6 py-16">
        <p className="text-red-600">Failed to load articles: {error.message}</p>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased">
      {/* HERO SECTION */}
      <section className="h-[250px] w-full bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white relative overflow-hidden flex items-center">
        {/* Background Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.3),transparent_60%)] pointer-events-none" />
        
        <div className="mx-auto w-full max-w-[1200px] px-6 relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider">
            Knowledge Base
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Learn
          </h1>
          <p className="text-sm md:text-base text-blue-100/80 max-w-xl font-normal leading-relaxed">
            Explore articles, guides, and insights to master business incubation, modern engineering standards, and enterprise development.
          </p>
        </div>
      </section>

      {/* CARDS GRID SECTION (3 COLUMNS) */}
      <main className="mx-auto w-full max-w-[1200px] px-6 py-16">
        {articles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-sm font-medium">No published articles yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link key={article.id} href={`/learn/${article.slug}`} className="group flex flex-col">
                {/* Cover Image Container */}
                <div className="overflow-hidden rounded-xl mb-4 aspect-[16/10] bg-gray-100">
                  {article.cover_image_url ? (
                    <img
                      src={article.cover_image_url}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-900 to-blue-950 flex items-center justify-center text-xs text-slate-500 font-medium">
                      No image available
                    </div>
                  )}
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug mb-2">
                  {article.title}
                </h2>

                {/* Description */}
                {article.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow">
                    {article.description}
                  </p>
                )}

                {/* Learn More Link */}
                <span className="text-blue-600 font-medium text-sm flex items-center gap-1 mt-auto group-hover:underline">
                  Learn more →
                </span>

                {/* Metadata */}
                {(article.author || article.published_at) && (
                  <p className="text-[11px] text-gray-400 mt-2">
                    {article.author && `By ${article.author}`}
                    {article.published_at && ` • ${new Date(article.published_at).toLocaleDateString()}`}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}