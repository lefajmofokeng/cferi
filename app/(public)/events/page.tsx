import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function EventsPage() {
  const supabase = await createClient();

  const { data: events, error } = await supabase
    .from("events")
    .select("id, title, slug, location, starts_at, cover_image_url")
    .eq("status", "published")
    .order("starts_at", { ascending: true });

  if (error) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-red-600">Failed to load events: {error.message}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-semibold mb-8">Events</h1>

      {events.length === 0 ? (
        <p className="text-gray-500">No events yet.</p>
      ) : (
        <ul className="space-y-6">
          {events.map((event) => (
            <li key={event.id} className="border-b border-gray-200 pb-6">
              {event.cover_image_url && (
                <img
                  src={event.cover_image_url}
                  alt={event.title}
                  className="w-full h-48 object-cover rounded mb-3"
                />
              )}
              <Link href={`/events/${event.slug}`} className="text-xl font-medium hover:underline">
                {event.title}
              </Link>
              <p className="text-gray-600 mt-1">
                {new Date(event.starts_at).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
                {event.location && ` — ${event.location}`}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}