import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";

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
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans antialiased">
      {/* HEADER / BREADCRUMB BAR */}
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Learn</span>
          </Link>
          <div className="text-xs font-medium text-slate-400">
            Article
          </div>
        </div>
      </header>

      {/* ARTICLE CONTENT CONTAINER */}
      <main className="mx-auto max-w-4xl px-6 py-10 md:py-16 space-y-10">
        
        {/* ARTICLE HEADER & METADATA */}
        <div className="space-y-6 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold uppercase tracking-wider">
            Knowledge Base
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            {article.title}
          </h1>

          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
              {article.author ? article.author.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="text-left text-xs">
              <p className="font-semibold text-slate-900">{article.author || "Editorial Team"}</p>
              {article.published_at && (
                <p className="text-slate-500">
                  Published {new Date(article.published_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                  })}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* COVER IMAGE */}
        {article.cover_image_url && (
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl bg-slate-900 shadow-xl border border-slate-200/80">
            <img
              src={article.cover_image_url}
              alt={article.title}
              className="w-full h-full object-cover object-center"
            />
          </div>
        )}

        {/* ARTICLE BODY CONTENT */}
        <article className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="text-slate-700 text-base md:text-lg leading-relaxed whitespace-pre-wrap font-normal space-y-6">
            {article.content}
          </div>
        </article>

        {/* FOOTER CALLOUT */}
        <div className="max-w-3xl mx-auto pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            Enjoyed this guide? Explore more articles in our learning repository.
          </p>
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold transition-all shadow-md"
          >
            Explore More Articles
          </Link>
        </div>

      </main>
    </div>
  );
}