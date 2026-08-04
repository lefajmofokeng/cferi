"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ApplyPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessStage, setBusinessStage] = useState("idea");
  const [businessDescription, setBusinessDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const supabase = createClient();
    let pitchDocumentUrl: string | null = null;

    if (file) {
      const filePath = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("pitch-documents")
        .upload(filePath, file);

      if (uploadError) {
        setStatus("error");
        setErrorMessage(`File upload failed: ${uploadError.message}`);
        return;
      }
      pitchDocumentUrl = filePath;
    }

    const { error } = await supabase.from("incubation_applications").insert({
      full_name: fullName,
      email,
      phone,
      business_name: businessName,
      business_stage: businessStage,
      business_description: businessDescription,
      pitch_document_url: pitchDocumentUrl,
    });

    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
    } else {
      setStatus("success");
      setFullName("");
      setEmail("");
      setPhone("");
      setBusinessName("");
      setBusinessStage("idea");
      setBusinessDescription("");
      setFile(null);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-3xl font-semibold mb-8">Apply for Incubation</h1>

      {status === "success" ? (
        <p className="text-green-700">
          Thanks — your application has been submitted. We&apos;ll be in touch.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Business Name</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Business Stage</label>
            <select
              value={businessStage}
              onChange={(e) => setBusinessStage(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="idea">Idea</option>
              <option value="early_stage">Early Stage</option>
              <option value="operating">Operating</option>
              <option value="scaling">Scaling</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Tell us about your business
            </label>
            <textarea
              required
              rows={5}
              value={businessDescription}
              onChange={(e) => setBusinessDescription(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Pitch Document (PDF or Word, optional)
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="bg-black text-white px-6 py-3 rounded hover:opacity-90 disabled:opacity-50"
          >
            {status === "submitting" ? "Submitting..." : "Submit Application"}
          </button>

          {status === "error" && (
            <p className="text-red-600 text-sm">{errorMessage}</p>
          )}
        </form>
      )}
    </main>
  );
}