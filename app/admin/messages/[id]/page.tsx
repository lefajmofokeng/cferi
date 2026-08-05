"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Message = {
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: string;
  submitted_at: string;
};

export default function MessageDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [msg, setMsg] = useState<Message | null>(null);
  const [status, setStatus] = useState("unread");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMessage() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("contact_messages")
        .select("name, email, subject, message, status, submitted_at")
        .eq("id", params.id)
        .single();

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      setMsg(data);

      // Auto-mark as read the first time an admin opens it,
      // but don't downgrade it if it was already "replied".
      if (data.status === "unread") {
        await supabase
          .from("contact_messages")
          .update({ status: "read" })
          .eq("id", params.id);
        setStatus("read");
      } else {
        setStatus(data.status);
      }

      setLoading(false);
    }
    loadMessage();
  }, [params.id]);

  async function handleSave() {
    setSaving(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase
      .from("contact_messages")
      .update({ status })
      .eq("id", params.id);

    if (error) {
      setError(error.message);
    } else {
      router.push("/admin/messages");
      router.refresh();
    }
    setSaving(false);
  }

  if (loading) {
    return <main className="px-8 py-8">Loading...</main>;
  }

  if (!msg) {
    return (
      <main className="px-8 py-8">
        <p className="text-red-600">{error || "Message not found."}</p>
      </main>
    );
  }

  return (
    <main className="px-8 py-8 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">
        {msg.subject || "No subject"}
      </h1>

      <div className="space-y-1 mb-6 text-sm text-gray-700">
        <p><strong>From:</strong> {msg.name} ({msg.email})</p>
        <p>
          <strong>Received:</strong>{" "}
          {new Date(msg.submitted_at).toLocaleString()}
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-sm font-medium mb-1">Message</h2>
        <p className="text-gray-700 whitespace-pre-wrap">{msg.message}</p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="unread">Unread</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
        </select>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-black text-white px-6 py-3 rounded hover:opacity-90 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save"}
      </button>

      {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
    </main>
  );
}