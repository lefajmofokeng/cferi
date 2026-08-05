"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function NewLearnArticlePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [status, setStatus] = useState("draft");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function slugify(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const supabase = createClient();
    let coverImageUrl: string | null = null;

    if (coverImage) {
      const filePath = `${Date.now()}-${coverImage.name}`;
      const { error: uploadError } = await supabase.storage
        .from("cover-images")
        .upload(filePath, coverImage);

      if (uploadError) {
        setError(`Image upload failed: ${uploadError.message}`);
        setSaving(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("cover-images")
        .getPublicUrl(filePath);
      coverImageUrl = publicUrlData.publicUrl;
    }

    const { error } = await supabase.from("learn_articles").insert({
      title,
      slug: slug || slugify(title),
      description,
      author,
      content,
      cover_image_url: coverImageUrl,
      status,
      published_at: status === "published" ? new Date().toISOString() : null,
    });

    if (error) {
      setError(error.message);
      setSaving(false);
    } else {
      router.push("/admin/learn");
      router.refresh();
    }
  }

  return (
    <main className="px-8 py-8 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">New Learn Article</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Slug (leave blank to auto-generate)
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder={title ? slugify(title) : ""}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Author</label>
          <input
            type="text"
            required
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Cover Image (optional)
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setCoverImage(e.target.files?.[0] ?? null)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <textarea
            required
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-black text-white px-6 py-3 rounded hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Article"}
        </button>

        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>
    </main>
  );
}