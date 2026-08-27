"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type PersonalFile = {
  id: string;
  file_name: string;
  file_path: string;
  uploaded_at: string;
};

export default function FilesDrawer() {
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

  if (loading) return <p className="text-gray-400 text-sm">Loading...</p>;

  return (
    <div className="space-y-4">
      <div>
        <label className="block bg-black text-white text-center px-4 py-2 rounded text-sm cursor-pointer hover:opacity-90">
          {uploading ? "Uploading..." : "+ Upload File"}
          <input
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
        {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
      </div>

      <div className="space-y-2">
        {files.length === 0 ? (
          <p className="text-gray-400 text-sm">No files uploaded yet.</p>
        ) : (
          files.map((file) => (
            <div
              key={file.id}
              className="border border-gray-200 rounded p-3 text-sm flex justify-between items-center gap-2"
            >
              <button
                onClick={() => handleOpen(file.file_path)}
                className="text-blue-600 hover:underline text-left truncate flex-1"
              >
                📄 {file.file_name}
              </button>
              <button
                onClick={() => handleDelete(file.id, file.file_path)}
                className="text-gray-300 hover:text-red-600 text-xs shrink-0"
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