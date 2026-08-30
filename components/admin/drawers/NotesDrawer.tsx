"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import "./NotesDrawer.css";

type Note = {
  id: string;
  content: string;
  updated_at: string;
};

interface NotesDrawerProps {
  id?: string;
}

export default function NotesDrawer({ id = "notes-drawer" }: NotesDrawerProps) {
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

  if (loading) {
    return (
      <section id={id} className="notes-drawer">
        <p className="notes-drawer__loading">Loading...</p>
      </section>
    );
  }

  return (
    <section id={id} className="notes-drawer">
      <div className="notes-drawer__form">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Take a note..."
          rows={3}
          className="notes-drawer__textarea"
        />
        <div className="notes-drawer__form-actions">
          <button
            type="button"
            onClick={handleAdd}
            disabled={saving || !newNote.trim()}
            className="notes-drawer__add-btn"
          >
            <svg className="notes-drawer__btn-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
            <span>{saving ? "Saving..." : "Save note"}</span>
          </button>
        </div>
      </div>

      <div className="notes-drawer__list">
        {notes.length === 0 ? (
          <p className="notes-drawer__empty">No notes yet.</p>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="notes-drawer__card">
              <p className="notes-drawer__card-content">{note.content}</p>
              <button
                type="button"
                onClick={() => handleDelete(note.id)}
                aria-label="Delete note"
                title="Delete note"
                className="notes-drawer__delete-btn"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}