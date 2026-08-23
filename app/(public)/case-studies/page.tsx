import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function CaseStudiesPage() {
  const supabase = await createClient();

  const { data: caseStudies, error } = await supabase
    .from("case_studies")
    .select("id, title, slug, client_name, industry, description, cover_image_url")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-red-600">Failed to load case studies: {error.message}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-semibold mb-8">Case Studies</h1>

      {caseStudies.length === 0 ? (
        <p className="text-gray-500">No case studies yet.</p>
      ) : (
        <ul className="space-y-6">
          {caseStudies.map((cs) => (
            <li key={cs.id} className="border-b border-gray-200 pb-6">
              {cs.cover_image_url && (
                <img
                  src={cs.cover_image_url}
                  alt={cs.title}
                  className="w-full h-48 object-cover rounded mb-3"
                />
              )}
              <Link href={`/case-studies/${cs.slug}`} className="text-xl font-medium hover:underline">
                {cs.title}
              </Link>
              <p className="text-sm text-gray-500 mt-1">
                {cs.client_name}
                {cs.industry && ` — ${cs.industry}`}
              </p>
              {cs.description && (
                <p className="text-gray-600 mt-1">{cs.description}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}