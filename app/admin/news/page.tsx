import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminNewsPage() {
  const supabase = await createClient();

  const { data: posts, error } = await supabase
    .from("news_posts")
    .select("id, title, status, published_at, updated_at")
    .order("updated_at", { ascending: false });

  if (error) {
    return (
      <main className="p-6 font-sans text-gray-800 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-[12px] p-4 text-xs text-red-600 flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Failed to load news: {error.message}</span>
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
            <span className="text-gray-800">News</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            News Manager
          </h1>
        </div>

        <Link
          href="/admin/news/new"
          className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-medium text-xs px-4 py-2.5 rounded-full shadow-xs transition-colors self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>New Post</span>
        </Link>
      </div>

      {/* Main Table Panel Container */}
      <div className="bg-white rounded-[15px] border border-gray-200/80 shadow-xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gray-50/40">
          <span className="text-xs font-semibold text-gray-600">
            All Posts ({posts.length})
          </span>
        </div>

        {posts.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-600">No news posts found</p>
            <p className="text-xs text-gray-400 mt-1">
              Create your first news article using the button above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60 text-gray-500 font-medium">
                  <th className="py-3 px-5">Title</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Updated</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {posts.map((post) => {
                  const isPublished = post.status === "published";

                  return (
                    <tr
                      key={post.id}
                      className="hover:bg-gray-50/80 transition-colors group"
                    >
                      <td className="py-3.5 px-5 font-semibold text-gray-900 max-w-sm truncate">
                        {post.title}
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
                          {post.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-500 font-mono text-[11px]">
                        {new Date(post.updated_at).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <Link
                          href={`/admin/news/${post.id}/edit`}
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