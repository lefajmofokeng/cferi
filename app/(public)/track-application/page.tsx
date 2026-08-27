"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type ApplicationResult = {
  full_name: string;
  business_name: string | null;
  status: string;
  submitted_at: string;
};

const statusStyles: Record<string, string> = {
  new: "bg-gray-100 text-gray-600",
  reviewing: "bg-yellow-100 text-yellow-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const statusLabels: Record<string, string> = {
  new: "Received",
  reviewing: "Under Review",
  accepted: "Accepted",
  rejected: "Not Successful",
};

export default function TrackApplicationPage() {
  const [referenceCode, setReferenceCode] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<ApplicationResult | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSearched(false);
    setResult(null);

    const supabase = createClient();
    const { data, error } = await supabase.rpc("get_application_status", {
      p_reference_code: referenceCode.trim(),
      p_email: email.trim(),
    });

    if (!error && data && data.length > 0) {
      setResult(data[0]);
    }

    setSearched(true);
    setLoading(false);
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl font-semibold mb-2">Track Your Application</h1>
      <p className="text-gray-500 mb-8">
        Enter your reference number and the email you applied with.
      </p>

      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Reference Number</label>
          <input
            type="text"
            required
            value={referenceCode}
            onChange={(e) => setReferenceCode(e.target.value)}
            placeholder="MTC-XXXXXXXX"
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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white px-6 py-3 rounded hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Searching..." : "Check Status"}
        </button>
      </form>

      {searched && !result && (
        <p className="text-red-600 text-sm mt-6">
          No application found. Double-check your reference number and email.
        </p>
      )}

      {result && (
        <div className="mt-8 border border-gray-200 rounded p-6">
          <p className="text-sm text-gray-500 mb-1">Applicant</p>
          <p className="font-medium mb-4">{result.full_name}</p>

          {result.business_name && (
            <>
              <p className="text-sm text-gray-500 mb-1">Business</p>
              <p className="font-medium mb-4">{result.business_name}</p>
            </>
          )}

          <p className="text-sm text-gray-500 mb-1">Status</p>
          <span
            className={`inline-block px-3 py-1 rounded text-sm font-medium ${
              statusStyles[result.status] ?? "bg-gray-100 text-gray-600"
            }`}
          >
            {statusLabels[result.status] ?? result.status}
          </span>

          <p className="text-xs text-gray-400 mt-4">
            Submitted {new Date(result.submitted_at).toLocaleDateString()}
          </p>
        </div>
      )}
    </main>
  );
}