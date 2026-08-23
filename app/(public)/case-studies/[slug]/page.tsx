import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ShareButtons from "@/components/public/ShareButtons";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: caseStudy } = await supabase
    .from("case_studies")
    .select("title, description, cover_image_url")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!caseStudy) return {};

  return {
    title: caseStudy.title,
    description: caseStudy.description ?? undefined,
    openGraph: {
      title: caseStudy.title,
      description: caseStudy.description ?? undefined,
      images: caseStudy.cover_image_url ? [caseStudy.cover_image_url] : [],
    },
  };
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: caseStudy, error } = await supabase
    .from("case_studies")
    .select("title, client_name, industry, outcomes, content, cover_image_url")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !caseStudy) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-semibold mb-2">{caseStudy.title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        {caseStudy.client_name}
        {caseStudy.industry && ` — ${caseStudy.industry}`}
      </p>

      {caseStudy.cover_image_url && (
        <img
          src={caseStudy.cover_image_url}
          alt={caseStudy.title}
          className="w-full max-h-96 object-cover rounded mb-6"
        />
      )}

      <div className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-8">
        {caseStudy.content}
      </div>

      {caseStudy.outcomes && (
        <div className="bg-gray-50 border border-gray-200 rounded p-6 mb-8">
          <h2 className="text-lg font-medium mb-2">Outcomes</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{caseStudy.outcomes}</p>
        </div>
      )}

      <div className="pt-6 border-t border-gray-200">
        <ShareButtons
          url={`${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/case-studies/${slug}`}
          title={caseStudy.title}
        />
      </div>
    </main>
  );
}