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
      <main className="mx-auto w-full max-w-[1200px] px-6 py-16">
        <p className="text-red-600">Failed to load events: {error.message}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1200px] px-6 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-10">Events</h1>

      {events.length === 0 ? (
        <p className="text-gray-500">No events yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <Link key={event.id} href={`/events/${event.slug}`} className="group flex flex-col">
              {event.cover_image_url && (
                <div className="overflow-hidden rounded-xl mb-4 aspect-[16/10] bg-gray-100">
                  <img
                    src={event.cover_image_url}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}
              <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug mb-2">
                {event.title}
              </h2>
              <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow">
                {new Date(event.starts_at).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
                {event.location && ` — ${event.location}`}
              </p>
              <span className="text-blue-600 font-medium text-sm flex items-center gap-1 mt-auto group-hover:underline">
                Learn more →
              </span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}