"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import "./FilesDrawer.css";

type PersonalFile = {
  id: string;
  file_name: string;
  file_path: string;
  uploaded_at: string;
};

interface FilesDrawerProps {
  id?: string;
}

export default function FilesDrawer({ id = "files-drawer" }: FilesDrawerProps) {
  const [files, setFiles] = useState<PersonalFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function loadFiles() {
    const supabase = createClient();
    const { data } = await supabase
      .from("personal_files")
      .select("id, file_name, file_path, uploaded_at")
      .order("uploaded_at", { ascending: false });
    setFiles(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadFiles();
  }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const filePath = `${user.id}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("personal-files")
      .upload(filePath, file);

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    await supabase.from("personal_files").insert({
      admin_id: user.id,
      file_name: file.name,
      file_path: filePath,
    });

    await loadFiles();
    setUploading(false);
  }

  async function handleOpen(filePath: string) {
    const supabase = createClient();
    const { data } = await supabase.storage
      .from("personal-files")
      .createSignedUrl(filePath, 3600);
    if (data?.signedUrl) {
      window.open(data.signedUrl, "_blank");
    }
  }

  async function handleDelete(id: string, filePath: string) {
    const supabase = createClient();
    await supabase.storage.from("personal-files").remove([filePath]);
    await supabase.from("personal_files").delete().eq("id", id);
    await loadFiles();
  }

  if (loading) {
    return (
      <section id={id} className="files-drawer">
        <p className="files-drawer__loading">Loading...</p>
      </section>
    );
  }

  return (
    <section id={id} className="files-drawer">
      <div className="files-drawer__upload-container">
        <label className={`files-drawer__upload-btn ${uploading ? "files-drawer__upload-btn--uploading" : ""}`}>
          <svg className="files-drawer__btn-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
          </svg>
          <span>{uploading ? "Uploading..." : "Upload File"}</span>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
            onChange={handleUpload}
            disabled={uploading}
            className="files-drawer__hidden-input"
          />
        </label>
        {error && <p className="files-drawer__error">{error}</p>}
      </div>

      <div className="files-drawer__list">
        {files.length === 0 ? (
          <p className="files-drawer__empty">No files uploaded yet.</p>
        ) : (
          files.map((file) => (
            <div key={file.id} className="files-drawer__card">
              <button
                type="button"
                onClick={() => handleOpen(file.file_path)}
                className="files-drawer__file-btn"
                title={`Open ${file.file_name}`}
              >
                <div className="files-drawer__icon-wrapper">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                  </svg>
                </div>
                <div className="files-drawer__file-details">
                  <span className="files-drawer__file-name">{file.file_name}</span>
                  <span className="files-drawer__file-date">
                    {new Date(file.uploaded_at).toLocaleDateString()}
                  </span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleDelete(file.id, file.file_path)}
                aria-label="Delete file"
                title="Delete file"
                className="files-drawer__delete-btn"
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