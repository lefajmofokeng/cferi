import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminAnnouncementsPage() {
  const supabase = await createClient();

  const { data: announcements, error } = await supabase
    .from("announcements")
    .select("id, title, is_pinned, status, updated_at")
    .order("updated_at", { ascending: false });

  if (error) {
    return (
      <main className="px-8 py-8">
        <p className="text-red-600">Failed to load announcements: {error.message}</p>
      </main>
    );
  }

  return (
    <main className="px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Announcements</h1>
        <Link
          href="/admin/announcements/new"
          className="bg-black text-white px-4 py-2 rounded text-sm hover:opacity-90"
        >
          + New Announcement
        </Link>
      </div>

      {announcements.length === 0 ? (
        <p className="text-gray-500">No announcements yet.</p>
      ) : (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left border-b border-gray-200 text-gray-500">
              <th className="py-2 pr-4">Title</th>
              <th className="py-2 pr-4">Pinned</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Last Updated</th>
              <th className="py-2 pr-4"></th>
            </tr>
          </thead>
          <tbody>
            {announcements.map((a) => (
              <tr key={a.id} className="border-b border-gray-100">
                <td className="py-3 pr-4">{a.title}</td>
                <td className="py-3 pr-4">{a.is_pinned ? "Yes" : "—"}</td>
                <td className="py-3 pr-4">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      a.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {a.status}
                  </span>
                </td>
                <td className="py-3 pr-4 text-gray-500">
                  {new Date(a.updated_at).toLocaleDateString()}
                </td>
                <td className="py-3 pr-4">
                  <Link
                    href={`/admin/announcements/${a.id}/edit`}
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