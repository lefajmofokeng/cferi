import { createClient } from "@/lib/supabase/server";

export default async function AdminFeedbackPage() {
  const supabase = await createClient();

  const { data: feedback, error } = await supabase
    .from("site_feedback")
    .select("id, page_url, is_helpful, comment, submitted_at")
    .order("submitted_at", { ascending: false });

  if (error) {
    return (
      <main className="px-8 py-8">
        <p className="text-red-600">Failed to load feedback: {error.message}</p>
      </main>
    );
  }

  const helpfulCount = feedback.filter((f) => f.is_helpful).length;
  const notHelpfulCount = feedback.filter((f) => !f.is_helpful).length;

  return (
    <main className="px-8 py-8">
      <h1 className="text-2xl font-semibold mb-2">Site Feedback</h1>
      <p className="text-sm text-gray-500 mb-6">
        {feedback.length} total responses — {helpfulCount} helpful, {notHelpfulCount} not helpful
      </p>

      {feedback.length === 0 ? (
        <p className="text-gray-500">No feedback submitted yet.</p>
      ) : (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left border-b border-gray-200 text-gray-500">
              <th className="py-2 pr-4">Page</th>
              <th className="py-2 pr-4">Rating</th>
              <th className="py-2 pr-4">Comment</th>
              <th className="py-2 pr-4">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {feedback.map((f) => (
              <tr key={f.id} className="border-b border-gray-100 align-top">
                <td className="py-3 pr-4 text-gray-700">{f.page_url}</td>
                <td className="py-3 pr-4">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      f.is_helpful
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {f.is_helpful ? "👍 Helpful" : "👎 Not Helpful"}
                  </span>
                </td>
                <td className="py-3 pr-4 text-gray-600 max-w-xs">
                  {f.comment || <span className="text-gray-300">—</span>}
                </td>
                <td className="py-3 pr-4 text-gray-500 whitespace-nowrap">
                  {new Date(f.submitted_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}