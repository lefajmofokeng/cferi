import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminLearnPage() {
  const supabase = await createClient();

  const { data: articles, error } = await supabase
    .from("learn_articles")
    .select("id, title, author, status, updated_at")
    .order("updated_at", { ascending: false });

  if (error) {
    return (
      <main className="px-8 py-8">
        <p className="text-red-600">Failed to load articles: {error.message}</p>
      </main>
    );
  }

  return (
    <main className="px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Learn Articles</h1>
        <Link
          href="/admin/learn/new"
          className="bg-black text-white px-4 py-2 rounded text-sm hover:opacity-90"
        >
          + New Article
        </Link>
      </div>

      {articles.length === 0 ? (
        <p className="text-gray-500">No articles yet.</p>
      ) : (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left border-b border-gray-200 text-gray-500">
              <th className="py-2 pr-4">Title</th>
              <th className="py-2 pr-4">Author</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Last Updated</th>
              <th className="py-2 pr-4"></th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id} className="border-b border-gray-100">
                <td className="py-3 pr-4">{article.title}</td>
                <td className="py-3 pr-4 text-gray-600">{article.author}</td>
                <td className="py-3 pr-4">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      article.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {article.status}
                  </span>
                </td>
                <td className="py-3 pr-4 text-gray-500">
                  {new Date(article.updated_at).toLocaleDateString()}
                </td>
                <td className="py-3 pr-4">
                  <Link
                    href={`/admin/learn/${article.id}/edit`}
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