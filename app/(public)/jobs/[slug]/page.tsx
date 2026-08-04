import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: job, error } = await supabase
    .from("job_posts")
    .select(
      "title, company_name, location, employment_type, description, requirements, application_url, closing_date"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !job) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-semibold mb-2">{job.title}</h1>
      <p className="text-gray-600 mb-1">
        {job.company_name}
        {job.location && ` — ${job.location}`}
      </p>
      {job.employment_type && (
        <p className="text-sm text-gray-500 mb-1 capitalize">
          {job.employment_type.replace("_", " ")}
        </p>
      )}
      {job.closing_date && (
        <p className="text-sm text-gray-400 mb-8">
          Closes: {new Date(job.closing_date).toLocaleDateString()}
        </p>
      )}

      <div className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-6">
        {job.description}
      </div>

      {job.requirements && (
        <>
          <h2 className="text-xl font-medium mb-2">Requirements</h2>
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-6">
            {job.requirements}
          </div>
        </>
      )}

      {job.application_url && (
        <a
          href={job.application_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-black text-white px-6 py-3 rounded hover:opacity-90"
        >
          Apply for this position
        </a>
      )}
    </main>
  );
}