import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminEventsPage() {
  const supabase = await createClient();

  const { data: events, error } = await supabase
    .from("events")
    .select("id, title, starts_at, status, updated_at")
    .order("starts_at", { ascending: false });

  if (error) {
    return (
      <main className="px-8 py-8">
        <p className="text-red-600">Failed to load events: {error.message}</p>
      </main>
    );
  }

  return (
    <main className="px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Events</h1>
        <Link
          href="/admin/events/new"
          className="bg-black text-white px-4 py-2 rounded text-sm hover:opacity-90"
        >
          + New Event
        </Link>
      </div>

      {events.length === 0 ? (
        <p className="text-gray-500">No events yet.</p>
      ) : (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left border-b border-gray-200 text-gray-500">
              <th className="py-2 pr-4">Title</th>
              <th className="py-2 pr-4">Date</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4"></th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-b border-gray-100">
                <td className="py-3 pr-4">{event.title}</td>
                <td className="py-3 pr-4 text-gray-600">
                  {new Date(event.starts_at).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </td>
                <td className="py-3 pr-4">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      event.status === "published"
                        ? "bg-green-100 text-green-700"
                        : event.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {event.status}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <Link
                    href={`/admin/events/${event.id}/edit`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}