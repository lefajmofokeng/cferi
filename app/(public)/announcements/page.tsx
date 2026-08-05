import { createClient } from "@/lib/supabase/server";

export default async function AnnouncementsPage() {
  const supabase = await createClient();

  const { data: announcements, error } = await supabase
    .from("announcements")
    .select("id, title, message, is_pinned, published_at")
    .eq("status", "published")
    .order("is_pinned", { ascending: false })
    .order("published_at", { ascending: false });

  if (error) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-red-600">Failed to load announcements: {error.message}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-semibold mb-8">Announcements</h1>

      {announcements.length === 0 ? (
        <p className="text-gray-500">No announcements yet.</p>
      ) : (
        <ul className="space-y-4">
          {announcements.map((a) => (
            <li
              key={a.id}
              className={`border rounded p-4 ${
                a.is_pinned ? "border-black bg-gray-50" : "border-gray-200"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {a.is_pinned && (
                  <span className="text-xs bg-black text-white px-2 py-0.5 rounded">
                    Pinned
                  </span>
                )}
                <h2 className="font-medium">{a.title}</h2>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{a.message}</p>
              {a.published_at && (
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(a.published_at).toLocaleDateString()}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}