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
    <>
      {/* Hero Section */}
      <section className="relative w-full bg-cover bg-center min-h-screen flex items-center justify-end bg-[url('https://images.pexels.com/photos/34586199/pexels-photo-34586199.jpeg')] bg-gray-900 text-white">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 py-16 text-right flex flex-col items-end">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 max-w-2xl">
            Maluti Incubation Center
          </h1>
          <p className="text-gray-200 text-lg max-w-xl">
            Supporting entrepreneurs and small businesses with mentorship,
            resources, and a collaborative space to grow.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-[1200px] px-6 py-16 space-y-16">
        {/* News Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Latest News</h2>
            <Link href="/news" className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1">
              See more →
            </Link>
          </div>

          {!news || news.length === 0 ? (
            <p className="text-gray-500">No news posts yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {news.map((post) => (
                <Link key={post.id} href={`/news/${post.slug}`} className="group flex flex-col">
                  {post.cover_image_url && (
                    <div className="overflow-hidden rounded-xl mb-4 aspect-[16/10] bg-gray-100">
                      <img
                        src={post.cover_image_url}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug mb-2">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow">
                      {post.excerpt}
                    </p>
                  )}
                  <span className="text-blue-600 font-medium text-sm flex items-center gap-1 mt-auto group-hover:underline">
                    Learn more →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Events Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Upcoming Events</h2>
            <Link href="/events" className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1">
              See more →
            </Link>
          </div>

          {!events || events.length === 0 ? (
            <p className="text-gray-500">No upcoming events.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
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
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug mb-2">
                    {event.title}
                  </h3>
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
        </section>
      </main>

      {/* Location Section */}
      <section className="w-full max-w-[1200px] mx-auto px-6 mb-16">
        <div className="rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 shadow-sm border border-gray-100">
          <div className="bg-black text-white p-10 flex flex-col justify-center">
            <h2 className="text-3xl font-semibold mb-4">Find Us</h2>
            <p className="text-gray-300 mb-8">
              Visit the Maluti TVET College Incubation Center — we&apos;d love to
              show you around and talk about your business idea.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-white text-black px-6 py-3 rounded-full font-medium w-fit hover:opacity-90 transition-opacity"
            >
              Get in Touch
            </Link>
          </div>
          <div className="min-h-[320px]">
            <iframe
              src="https://www.google.com/maps?q=Maluti+TVET+College&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "320px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
}