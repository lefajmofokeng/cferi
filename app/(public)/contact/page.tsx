"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");

    const supabase = createClient();
    const { error } = await supabase.from("contact_messages").insert({
      name,
      email,
      subject,
      message,
    });

    if (error) {
      setStatus("error");
    } else {
      setStatus("success");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-3xl font-semibold mb-8">Contact Us</h1>

      {status === "success" ? (
        <p className="text-green-700">
          Thanks — your message has been sent. We&apos;ll get back to you soon.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            <label className="block text-sm font-medium mb-1">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="bg-black text-white px-6 py-3 rounded hover:opacity-90 disabled:opacity-50"
          >
            {status === "submitting" ? "Sending..." : "Send Message"}
          </button>

          {status === "error" && (
            <p className="text-red-600 text-sm">
              Something went wrong. Please try again.
            </p>
          )}
        </form>
      )}
    </main>
  );
}