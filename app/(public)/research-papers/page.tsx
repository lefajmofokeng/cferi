import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function ResearchPapersPage() {
  const supabase = await createClient();

  const { data: papers, error } = await supabase
    .from("research_papers")
    .select("id, title, slug, author, description, cover_image_url, category, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-red-600">Failed to load research papers: {error.message}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-semibold mb-8">Research Papers</h1>

      {papers.length === 0 ? (
        <p className="text-gray-500">No research papers yet.</p>
      ) : (
        <ul className="space-y-6">
          {papers.map((paper) => (
            <li key={paper.id} className="border-b border-gray-200 pb-6">
              {paper.cover_image_url && (
                <img
                  src={paper.cover_image_url}
                  alt={paper.title}
                  className="w-full h-48 object-cover rounded mb-3"
                />
              )}
              {paper.category && (
                <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded mb-2">
                  {paper.category}
                </span>
              )}
              <Link href={`/research-papers/${paper.slug}`} className="text-xl font-medium hover:underline block">
                {paper.title}
              </Link>
              <p className="text-sm text-gray-500 mt-1">
                By {paper.author}
                {paper.published_at &&
                  ` · ${new Date(paper.published_at).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}`}
              </p>
              {paper.description && (
                <p className="text-gray-600 mt-1">{paper.description}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}