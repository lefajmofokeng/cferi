import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminMessagesPage() {
  const supabase = await createClient();

  const { data: messages, error } = await supabase
    .from("contact_messages")
    .select("id, name, email, subject, status, submitted_at")
    .order("submitted_at", { ascending: false });

  if (error) {
    return (
      <main className="px-8 py-8">
        <p className="text-red-600">Failed to load messages: {error.message}</p>
      </main>
    );
  }

  return (
    <main className="px-8 py-8">
      <h1 className="text-2xl font-semibold mb-6">Contact Messages</h1>

      {messages.length === 0 ? (
        <p className="text-gray-500">No messages yet.</p>
      ) : (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left border-b border-gray-200 text-gray-500">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Subject</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Received</th>
              <th className="py-2 pr-4"></th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr key={msg.id} className="border-b border-gray-100">
                <td className="py-3 pr-4">{msg.name}</td>
                <td className="py-3 pr-4 text-gray-600">{msg.subject || "—"}</td>
                <td className="py-3 pr-4">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      msg.status === "replied"
                        ? "bg-green-100 text-green-700"
                        : msg.status === "read"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {msg.status}
                  </span>
                </td>
                <td className="py-3 pr-4 text-gray-500">
                  {new Date(msg.submitted_at).toLocaleDateString()}
                </td>
                <td className="py-3 pr-4">
                  <Link
                    href={`/admin/messages/${msg.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View
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