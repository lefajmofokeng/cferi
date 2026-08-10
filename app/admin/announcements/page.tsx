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
      <main className="p-6 font-sans text-gray-800 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-[12px] p-4 text-xs text-red-600 flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Failed to load announcements: {error.message}</span>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 font-sans text-gray-800 max-w-7xl mx-auto space-y-6">
      {/* Top Console Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-1">
            <span>Content</span>
            <span>/</span>
            <span className="text-gray-800">Announcements</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Announcements Manager
          </h1>
        </div>

        <Link
          href="/admin/announcements/new"
          className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-medium text-xs px-4 py-2.5 rounded-full shadow-xs transition-colors self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>New Announcement</span>
        </Link>
      </div>

      {/* Main Table Panel Container */}
      <div className="bg-white rounded-[15px] border border-gray-200/80 shadow-xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gray-50/40">
          <span className="text-xs font-semibold text-gray-600">
            All Announcements ({announcements.length})
          </span>
        </div>

        {announcements.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5.882T6.7 4a1 1 0 00-1 1v10.158a1 1 0 00.553.894l4.553 2.277a2 2 0 001.788 0l4.553-2.277a1 1 0 00.553-.894V5a1 1 0 00-1-1 9.97 9.97 0 00-4.3 1.882z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-600">No announcements found</p>
            <p className="text-xs text-gray-400 mt-1">
              Create your first announcement using the button above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60 text-gray-500 font-medium">
                  <th className="py-3 px-5">Title</th>
                  <th className="py-3 px-4">Pinned</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Updated</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {announcements.map((a) => {
                  const isPublished = a.status === "published";

                  return (
                    <tr
                      key={a.id}
                      className="hover:bg-gray-50/80 transition-colors group"
                    >
                      <td className="py-3.5 px-5 font-semibold text-gray-900 max-w-xs truncate">
                        {a.title}
                      </td>
                      <td className="py-3.5 px-4">
                        {a.is_pinned ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md">
                            <svg className="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 2a1 1 0 011 1v1.323l1.954 1.564A2 2 0 0113.732 7.3L13 13.5a1 1 0 00.293.707l1.414 1.414a1 1 0 01-.707 1.707H6a1 1 0 01-.707-1.707l1.414-1.414A1 1 0 007 13.5L6.268 7.3a2 2 0 01.778-1.413L9 4.323V3a1 1 0 011-1z" />
                            </svg>
                            Pinned
                          </span>
                        ) : (
                          <span className="text-gray-400 font-medium">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${
                            isPublished
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                              : "bg-gray-100 text-gray-600 border border-gray-200/60"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isPublished ? "bg-emerald-500" : "bg-gray-400"
                            }`}
                          />
                          {a.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-500 font-mono text-[11px]">
                        {new Date(a.updated_at).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <Link
                          href={`/admin/announcements/${a.id}/edit`}
                          className="inline-flex items-center gap-1 font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-2.5 py-1 rounded-md transition-colors"
                        >
                          <span>Edit</span>
                          <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}