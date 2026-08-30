"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import "./FeedbackWidget.css";

interface FeedbackWidgetProps {
  id?: string;
}

export default function FeedbackWidget({
  id = "feedback-widget",
}: FeedbackWidgetProps) {
  const pathname = usePathname();
  const [step, setStep] = useState<"question" | "comment" | "done">("question");
  const [isHelpful, setIsHelpful] = useState<boolean | null>(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleAnswer(helpful: boolean) {
    setIsHelpful(helpful);
    setStep("comment");
  }

  async function handleSubmitComment() {
    setSubmitting(true);

    const supabase = createClient();
    await supabase.from("site_feedback").insert({
      page_url: pathname,
      is_helpful: isHelpful,
      comment: comment.trim() || null,
    });

    setSubmitting(false);
    setStep("done");
  }

  if (step === "done") {
    return (
      <section id={id} className="feedback-widget">
        <div className="feedback-widget__container">
          <p className="feedback-widget__title">Thanks for your feedback.</p>
        </div>
      </section>
    );
  }

  if (step === "comment") {
    return (
      <section id={id} className="feedback-widget">
        <div className="feedback-widget__container feedback-widget__container--row">
          <div className="feedback-widget__info">
            <p className="feedback-widget__title">
              Please share any comments or feedback about your experience on this page.
            </p>
            <p className="feedback-widget__description">
              Don&apos;t disclose any personal, commercially sensitive, or confidential information.
            </p>
          </div>
          <div className="feedback-widget__form-group">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="feedback-widget__textarea"
            />
            <button
              onClick={handleSubmitComment}
              disabled={submitting}
              className="feedback-widget__button"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id={id} className="feedback-widget">
      <div className="feedback-widget__container feedback-widget__container--row">
        <div className="feedback-widget__info">
          <p className="feedback-widget__title">
            Did you find what you were looking for today?
          </p>
          <p className="feedback-widget__description">
            Let us know so we can improve the quality of the content on our pages.
          </p>
        </div>
        <div className="feedback-widget__button-group">
          <button
            onClick={() => handleAnswer(true)}
            className="feedback-widget__button"
          >
            Yes 👍
          </button>
          <button
            onClick={() => handleAnswer(false)}
            className="feedback-widget__button"
          >
            No 👎
          </button>
        </div>
      </div>
    </section>
  );
}