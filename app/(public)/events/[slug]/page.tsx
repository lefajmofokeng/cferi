import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: event, error } = await supabase
    .from("events")
    .select("title, description, location, starts_at, ends_at")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !event) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-semibold mb-2">{event.title}</h1>

      <p className="text-gray-600 mb-1">
        {new Date(event.starts_at).toLocaleString(undefined, {
          dateStyle: "full",
          timeStyle: "short",
        })}
        {event.ends_at &&
          ` – ${new Date(event.ends_at).toLocaleString(undefined, {
            timeStyle: "short",
          })}`}
      </p>

      {event.location && (
        <p className="text-gray-500 mb-8">{event.location}</p>
      )}

      <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
        {event.description}
      </div>
    </main>
  );
}