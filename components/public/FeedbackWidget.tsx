"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function FeedbackWidget() {
  const pathname = usePathname();
  const [step, setStep] = useState<"question" | "comment" | "done">("question");
  const [isHelpful, setIsHelpful] = useState<boolean | null>(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleAnswer(helpful: boolean) {
    setIsHelpful(helpful);

    const supabase = createClient();
    await supabase.from("site_feedback").insert({
      page_url: pathname,
      is_helpful: helpful,
    });

    setStep("comment");
  }

  async function handleSubmitComment() {
    if (!comment.trim()) {
      setStep("done");
      return;
    }

    setSubmitting(true);
    const supabase = createClient();

    // Update the most recent feedback row from this page with the comment,
    // rather than inserting a duplicate row.
    const { data } = await supabase
      .from("site_feedback")
      .select("id")
      .eq("page_url", pathname)
      .eq("is_helpful", isHelpful)
      .order("submitted_at", { ascending: false })
      .limit(1)
      .single();

    if (data) {
      await supabase
        .from("site_feedback")
        .update({ comment: comment.trim() })
        .eq("id", data.id);
    }

    setSubmitting(false);
    setStep("done");
  }

  if (step === "done") {
    return (
      <div className="rounded-lg bg-gradient-to-r from-orange-200 to-amber-200 px-8 py-6">
        <p className="font-medium text-gray-900">Thanks for your feedback.</p>
      </div>
    );
  }

  if (step === "comment") {
    return (
      <div className="rounded-lg bg-gradient-to-r from-orange-200 to-amber-200 px-8 py-6 flex flex-col md:flex-row md:items-start gap-4 md:justify-between">
        <div>
          <p className="font-medium text-gray-900 mb-1">
            Please share any comments or feedback about your experience on this page.
          </p>
          <p className="text-sm text-gray-700">
            Don&apos;t disclose any personal, commercially sensitive, or confidential information.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 w-full md:w-auto">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="w-full md:w-80 border border-gray-300 rounded px-3 py-2 text-sm bg-white"
          />
          <button
            onClick={handleSubmitComment}
            disabled={submitting}
            className="bg-gray-900 text-white px-6 py-2 rounded-full text-sm hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-gradient-to-r from-orange-200 to-amber-200 px-8 py-6 flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
      <div>
        <p className="font-medium text-gray-900 mb-1">
          Did you find what you were looking for today?
        </p>
        <p className="text-sm text-gray-700">
          Let us know so we can improve the quality of the content on our pages.
        </p>
      </div>
      <div className="flex gap-3 shrink-0">
        <button
          onClick={() => handleAnswer(true)}
          className="bg-gray-900 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90"
        >
          Yes 👍
        </button>
        <button
          onClick={() => handleAnswer(false)}
          className="bg-gray-900 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90"
        >
          No 👎
        </button>
      </div>
    </div>
  );
}