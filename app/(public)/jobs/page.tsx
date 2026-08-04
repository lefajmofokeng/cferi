import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function JobsPage() {
  const supabase = await createClient();

  const { data: jobs, error } = await supabase
    .from("job_posts")
    .select("id, title, slug, company_name, location, employment_type, closing_date")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-red-600">Failed to load jobs: {error.message}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-semibold mb-8">Job Opportunities</h1>

      {jobs.length === 0 ? (
        <p className="text-gray-500">No job posts yet.</p>
      ) : (
        <ul className="space-y-6">
          {jobs.map((job) => (
            <li key={job.id} className="border-b border-gray-200 pb-6">
              <Link href={`/jobs/${job.slug}`} className="text-xl font-medium hover:underline">
                {job.title}
              </Link>
              <p className="text-gray-600 mt-1">
                {job.company_name}
                {job.location && ` — ${job.location}`}
              </p>
              {job.closing_date && (
                <p className="text-sm text-gray-400 mt-1">
                  Closes: {new Date(job.closing_date).toLocaleDateString()}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}