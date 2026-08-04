"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Application = {
  full_name: string;
  email: string;
  phone: string | null;
  business_name: string | null;
  business_stage: string | null;
  business_description: string;
  pitch_document_url: string | null;
  status: string;
  reviewer_notes: string | null;
  submitted_at: string;
};

export default function ApplicationDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [application, setApplication] = useState<Application | null>(null);
  const [status, setStatus] = useState("new");
  const [reviewerNotes, setReviewerNotes] = useState("");
  const [documentLink, setDocumentLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadApplication() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("incubation_applications")
        .select(
          "full_name, email, phone, business_name, business_stage, business_description, pitch_document_url, status, reviewer_notes, submitted_at"
        )
        .eq("id", params.id)
        .single();

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      setApplication(data);
      setStatus(data.status);
      setReviewerNotes(data.reviewer_notes ?? "");

      // Generate a temporary signed URL for the private pitch document,
      // valid for 1 hour, so admins can view it without the bucket being public.
      if (data.pitch_document_url) {
        const { data: signedData } = await supabase.storage
          .from("pitch-documents")
          .createSignedUrl(data.pitch_document_url, 3600);
        if (signedData) setDocumentLink(signedData.signedUrl);
      }

      setLoading(false);
    }
    loadApplication();
  }, [params.id]);

  async function handleSave() {
    setSaving(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase
      .from("incubation_applications")
      .update({ status, reviewer_notes: reviewerNotes })
      .eq("id", params.id);

    if (error) {
      setError(error.message);
    } else {
      router.push("/admin/applications");
      router.refresh();
    }
    setSaving(false);
  }

  if (loading) {
    return <main className="px-8 py-8">Loading...</main>;
  }

  if (!application) {
    return (
      <main className="px-8 py-8">
        <p className="text-red-600">{error || "Application not found."}</p>
      </main>
    );
  }

  return (
    <main className="px-8 py-8 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">{application.full_name}</h1>

      <div className="space-y-1 mb-6 text-sm text-gray-700">
        <p><strong>Email:</strong> {application.email}</p>
        {application.phone && <p><strong>Phone:</strong> {application.phone}</p>}
        {application.business_name && (
          <p><strong>Business:</strong> {application.business_name}</p>
        )}
        {application.business_stage && (
          <p className="capitalize">
            <strong>Stage:</strong> {application.business_stage.replace("_", " ")}
          </p>
        )}
        <p>
          <strong>Submitted:</strong>{" "}
          {new Date(application.submitted_at).toLocaleString()}
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-sm font-medium mb-1">Business Description</h2>
        <p className="text-gray-700 whitespace-pre-wrap">
          {application.business_description}
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-sm font-medium mb-1">Pitch Document</h2>
        {documentLink ? (
          <a
            href={documentLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            View document
          </a>
        ) : (
          <p className="text-gray-500">No document uploaded.</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="new">New</option>
          <option value="reviewing">Reviewing</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Reviewer Notes</label>
        <textarea
          rows={4}
          value={reviewerNotes}
          onChange={(e) => setReviewerNotes(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
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