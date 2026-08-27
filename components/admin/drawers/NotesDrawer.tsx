"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Note = {
  id: string;
  content: string;
  updated_at: string;
};

export default function NotesDrawer() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadNotes() {
    const supabase = createClient();
    const { data } = await supabase
      .from("personal_notes")
      .select("id, content, updated_at")
      .order("updated_at", { ascending: false });
    setNotes(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadNotes();
  }, []);

  async function handleAdd() {
    if (!newNote.trim()) return;
    setSaving(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("personal_notes").insert({
      admin_id: user.id,
      content: newNote.trim(),
    });

    setNewNote("");
    await loadNotes();
    setSaving(false);
  }

  async function handleDelete(id: string) {
    const supabase = createClient();
    await supabase.from("personal_notes").delete().eq("id", id);
    await loadNotes();
  }

  if (loading) return <p className="text-gray-400 text-sm">Loading...</p>;

  return (
    <div className="space-y-4">
      <div>
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Write a note..."
          rows={3}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        />
        <button
          onClick={handleAdd}
          disabled={saving}
          className="mt-2 bg-black text-white px-4 py-1.5 rounded text-sm hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Add Note"}
        </button>
      </div>

      <div className="space-y-2">
        {notes.length === 0 ? (
          <p className="text-gray-400 text-sm">No notes yet.</p>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="border border-gray-200 rounded p-3 text-sm flex justify-between items-start gap-2"
            >
              <p className="whitespace-pre-wrap flex-1">{note.content}</p>
              <button
                onClick={() => handleDelete(note.id)}
                className="text-gray-300 hover:text-red-600 text-xs"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}