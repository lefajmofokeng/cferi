"use client";

import { useState } from "react";

export default function ShareButtons({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopyLink() {
    try {
      if (!navigator.clipboard) {
        return;
      }

      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-xs text-gray-500">Share:</span>

      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-gray-600 hover:text-gray-900"
      >
        WhatsApp
      </a>

      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-gray-600 hover:text-gray-900"
      >
        X
      </a>

      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-gray-600 hover:text-gray-900"
      >
        Facebook
      </a>

      <a
        href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`}
        className="text-sm text-gray-600 hover:text-gray-900"
      >
        Email
      </a>

      <button
        type="button"
        onClick={handleCopyLink}
        aria-label="Copy share link"
        className="text-sm text-gray-600 hover:text-gray-900"
      >
        {copied ? "Copied!" : "Copy Link"}
      </button>
    </div>
  );
}