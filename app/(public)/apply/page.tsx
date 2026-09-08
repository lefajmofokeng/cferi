"use client";

import { useState, useEffect } from "react";
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
  const [referenceCode, setReferenceCode] = useState("");

  const [isThaboMofutsanyanaResident, setIsThaboMofutsanyanaResident] = useState<boolean | null>(null);
  const [applicantCategories, setApplicantCategories] = useState<string[]>([]);
  const [cipcRegistered, setCipcRegistered] = useState("");
  const [taxCompliant, setTaxCompliant] = useState("");

  const hasExistingBusiness = businessStage !== "idea";

  const [checkingStatus, setCheckingStatus] = useState(true);
  const [applicationsOpen, setApplicationsOpen] = useState(true);

  function toggleCategory(category: string) {
    setApplicantCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  }

  useEffect(() => {

  async function checkApplicationsStatus() {
    const supabase = createClient();
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "applications_open")
      .single();

    setApplicationsOpen(data ? data.value : true);
    setCheckingStatus(false);
  }
  checkApplicationsStatus();
    }, []);

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

    const code = `MTC-${Date.now().toString(36).toUpperCase()}`;

    const { error } = await supabase.from("incubation_applications").insert({
      full_name: fullName,
      email,
      phone,
      business_name: businessName,
      business_stage: businessStage,
      business_description: businessDescription,
      pitch_document_url: pitchDocumentUrl,
      reference_code: code,
      is_thabo_mofutsanyana_resident: isThaboMofutsanyanaResident,
      applicant_categories: applicantCategories,
      cipc_registered: hasExistingBusiness ? cipcRegistered || null : null,
      tax_compliant: hasExistingBusiness ? taxCompliant || null : null,
    });

    if (!error) {
      setReferenceCode(code);
    }

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
      setIsThaboMofutsanyanaResident(null);
      setApplicantCategories([]);
      setCipcRegistered("");
      setTaxCompliant("");
    }
  }

  if (checkingStatus) {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <p className="text-gray-400">Loading...</p>
    </main>
  );
}

if (!applicationsOpen) {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-3xl font-semibold mb-4">Apply for Incubation</h1>
      <div className="bg-gray-50 border border-gray-200 rounded p-6">
        <p className="text-gray-700 mb-2 font-medium">
          Applications are currently closed.
        </p>
        <p className="text-gray-600 text-sm">
          We&apos;re not accepting new incubation applications at this time.
          Please check back later, or follow our{" "}
          <a href="/announcements" className="text-blue-600 hover:underline">
            Announcements
          </a>{" "}
          page for updates on when the next intake opens.
        </p>
      </div>
    </main>
  );
}

return (
  <main className="mx-auto max-w-2xl px-6 py-12">
    <h1 className="text-3xl font-semibold mb-8">Apply for Incubation</h1>

    {status === "success" ? (
        <div className="text-green-700 space-y-3">
          <p>Thanks — your application has been submitted. We&apos;ll be in touch.</p>
          <div className="bg-gray-50 border border-gray-200 rounded p-4">
            <p className="text-sm text-gray-600 mb-1">Your reference number:</p>
            <p className="text-lg font-mono font-semibold text-gray-900">{referenceCode}</p>
            <p className="text-xs text-gray-500 mt-2">
              Save this — you&apos;ll need it to check your application status later.
            </p>
          </div>
        </div>
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
            <label className="block text-sm font-medium mb-1">
              Are you a resident of Thabo Mofutsanyana District?
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="residency"
                  required
                  checked={isThaboMofutsanyanaResident === true}
                  onChange={() => setIsThaboMofutsanyanaResident(true)}
                />
                Yes
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="residency"
                  checked={isThaboMofutsanyanaResident === false}
                  onChange={() => setIsThaboMofutsanyanaResident(false)}
                />
                No
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              This program is open to registered Maluti TVET College students,
              alumni, and local youth entrepreneurs. Which applies to you? (select all that apply)
            </label>
            <div className="space-y-1">
              {[
                { value: "student", label: "Registered Maluti TVET College Student" },
                { value: "alumni", label: "Maluti TVET College Alumni" },
                { value: "local_youth_entrepreneur", label: "Local Youth Entrepreneur" },
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={applicantCategories.includes(option.value)}
                    onChange={() => toggleCategory(option.value)}
                  />
                  {option.label}
                </label>
              ))}
            </div>
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

          {hasExistingBusiness && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Is your business registered with CIPC?
                </label>
                <select
                  value={cipcRegistered}
                  onChange={(e) => setCipcRegistered(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">Select an option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="in_progress">In Progress</option>
                  <option value="not_sure">Not Sure</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Is your business tax compliant?
                </label>
                <select
                  value={taxCompliant}
                  onChange={(e) => setTaxCompliant(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">Select an option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="in_progress">In Progress</option>
                  <option value="not_sure">Not Sure</option>
                </select>
              </div>
            </>
          )}

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