import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();

  const { data: news } = await supabase
    .from("news_posts")
    .select("id, title, slug, excerpt, cover_image_url")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(3);

  const { data: events } = await supabase
    .from("events")
    .select("id, title, slug, location, starts_at, cover_image_url")
    .eq("status", "published")
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true })
    .limit(3);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <section className="mb-8">
        <h1 className="text-4xl font-semibold mb-3">Maluti Incubation Center</h1>
        <p className="text-gray-600 max-w-2xl">
          Supporting entrepreneurs and small businesses with mentorship,
          resources, and a collaborative space to grow.
        </p>
      </section>

      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Latest News</h2>
          <Link href="/news" className="text-sm text-blue-600 hover:underline">
            See more →
          </Link>
        </div>

        {!news || news.length === 0 ? (
          <p className="text-gray-500">No news posts yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {news.map((post) => (
              <Link key={post.id} href={`/news/${post.slug}`} className="group">
                {post.cover_image_url && (
                  <img
                    src={post.cover_image_url}
                    alt={post.title}
                    className="w-full h-40 object-cover rounded mb-3"
                  />
                )}
                <h3 className="font-medium group-hover:underline">{post.title}</h3>
                {post.excerpt && (
                  <p className="text-sm text-gray-600 mt-1">{post.excerpt}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Upcoming Events</h2>
          <Link href="/events" className="text-sm text-blue-600 hover:underline">
            See more →
          </Link>
        </div>

        {!events || events.length === 0 ? (
          <p className="text-gray-500">No upcoming events.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {events.map((event) => (
              <Link key={event.id} href={`/events/${event.slug}`} className="group">
                {event.cover_image_url && (
                  <img
                    src={event.cover_image_url}
                    alt={event.title}
                    className="w-full h-40 object-cover rounded mb-3"
                  />
                )}
                <h3 className="font-medium group-hover:underline">{event.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date(event.starts_at).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                  {event.location && ` — ${event.location}`}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}