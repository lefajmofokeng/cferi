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

  const { data: event } = await supabase
    .from("events")
    .select("title, description, cover_image_url")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!event) return {};

  return {
    title: event.title,
    description: event.description?.slice(0, 160),
    openGraph: {
      title: event.title,
      description: event.description?.slice(0, 160),
      images: event.cover_image_url ? [event.cover_image_url] : [],
    },
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: event, error } = await supabase
    .from("events")
    .select("title, description, location, starts_at, ends_at, cover_image_url")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !event) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-[1200px] px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Details Section */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-semibold mb-4 text-gray-900">{event.title}</h1>

          {event.cover_image_url && (
            <div className="overflow-hidden rounded-xl mb-6 bg-gray-100">
              <img
                src={event.cover_image_url}
                alt={event.title}
                className="w-full max-h-[420px] object-cover"
              />
            </div>
          )}

          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {event.description}
          </div>
        </div>

        {/* Event Meta Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-6 space-y-4 sticky top-8">
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-3">
              Event Details
            </h2>

            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                Date & Time
              </span>
              <p className="text-sm text-gray-700">
                {new Date(event.starts_at).toLocaleString(undefined, {
                  dateStyle: "full",
                  timeStyle: "short",
                })}
                {event.ends_at &&
                  ` – ${new Date(event.ends_at).toLocaleString(undefined, {
                    timeStyle: "short",
                  })}`}
              </p>
            </div>

            {event.location && (
              <div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                  Location
                </span>
                <p className="text-sm text-gray-700">{event.location}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-gray-200">
  <ShareButtons
    url={`${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/events/${slug}`}
    title={event.title}
  />
</div>
    </main>
  );
}