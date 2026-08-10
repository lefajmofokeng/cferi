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
      <main className="p-6 font-sans text-gray-800 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-[12px] p-4 text-xs text-red-600 flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Failed to load messages: {error.message}</span>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 font-sans text-gray-800 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-1">
            <span>Admin</span>
            <span>/</span>
            <span className="text-gray-800">Contact Messages</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Inbound Messages
          </h1>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-[15px] border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gray-50/40">
          <span className="text-xs font-semibold text-gray-600">
            Total Messages ({messages.length})
          </span>
        </div>

        {messages.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <svg className="w-8 h-8 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-xs font-semibold text-gray-600">No messages found</p>
            <p className="text-[11px] text-gray-400">Inbound submissions from the contact form will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60 text-gray-500 font-medium">
                  <th className="py-3 px-5">Sender</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Received</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {messages.map((msg) => {
                  const isReplied = msg.status === "replied";
                  const isRead = msg.status === "read";

                  return (
                    <tr key={msg.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 px-5 font-semibold text-gray-900">
                        <div>{msg.name}</div>
                        <div className="text-[11px] font-normal text-gray-400">{msg.email}</div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-gray-600 max-w-xs truncate">
                        {msg.subject || "—"}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium capitalize ${
                            isReplied
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                              : isRead
                              ? "bg-amber-50 text-amber-700 border border-amber-200/60"
                              : "bg-gray-100 text-gray-600 border border-gray-200/60"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isReplied ? "bg-emerald-500" : isRead ? "bg-amber-500" : "bg-gray-400"
                            }`}
                          />
                          {msg.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-500 font-mono text-[11px]">
                        {new Date(msg.submitted_at).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <Link
                          href={`/admin/messages/${msg.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-gray-900 hover:text-gray-600 transition-colors"
                        >
                          <span>View</span>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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