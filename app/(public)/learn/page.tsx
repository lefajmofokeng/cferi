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
      <main className="mx-auto max-w-6xl px-6 py-12">
        <p className="text-red-600">Failed to load articles: {error.message}</p>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans antialiased">
      {/* 250px GRADIENT HERO SECTION */}
      <section className="h-[250px] w-full bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white relative overflow-hidden flex items-center">
        {/* Background Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.3),transparent_60%)] pointer-events-none" />
        
        <div className="mx-auto max-w-6xl px-6 w-full relative z-10 space-y-2">
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
      <main className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        {articles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
            <p className="text-slate-500 text-sm font-medium">No published articles yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <article 
                key={article.id} 
                className="flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Cover Image Container */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-slate-900 shadow-md border border-slate-200/60">
                    {article.cover_image_url ? (
                      <img
                        src={article.cover_image_url}
                        alt={article.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-900 to-blue-950 flex items-center justify-center text-xs text-slate-500 font-medium">
                        No image available
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                    <Link href={`/learn/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h2>

                  {/* Description */}
                  {article.description && (
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 font-normal">
                      {article.description}
                    </p>
                  )}
                </div>

                {/* Learn More Link & Metadata */}
                <div className="pt-4 space-y-2">
                  <Link 
                    href={`/learn/${article.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <span>Learn more</span>
                    <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>

                  {(article.author || article.published_at) && (
                    <p className="text-[11px] text-slate-400">
                      {article.author && `By ${article.author}`}
                      {article.published_at && ` • ${new Date(article.published_at).toLocaleDateString()}`}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}