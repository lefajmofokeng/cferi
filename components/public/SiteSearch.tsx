"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { staticSearchIndex } from "@/lib/searchIndex";

type Result = {
  title: string;
  href: string;
  type: string;
};

export default function SiteSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      const supabase = createClient();
      const pattern = `%${trimmed}%`;

      const [news, jobs, events, learn, caseStudies, researchPapers] = await Promise.all([
        supabase
          .from("news_posts")
          .select("title, slug")
          .eq("status", "published")
          .ilike("title", pattern)
          .limit(5),
        supabase
          .from("job_posts")
          .select("title, slug")
          .eq("status", "published")
          .ilike("title", pattern)
          .limit(5),
        supabase
          .from("events")
          .select("title, slug")
          .eq("status", "published")
          .ilike("title", pattern)
          .limit(5),
        supabase
          .from("learn_articles")
          .select("title, slug")
          .eq("status", "published")
          .ilike("title", pattern)
          .limit(5),
        supabase
          .from("case_studies")
          .select("title, slug")
          .eq("status", "published")
          .ilike("title", pattern)
          .limit(5),
        supabase
          .from("research_papers")
          .select("title, slug")
          .eq("status", "published")
          .ilike("title", pattern)
          .limit(5),
      ]);

      const dynamicResults: Result[] = [
        ...(news.data ?? []).map((n) => ({ title: n.title, href: `/news/${n.slug}`, type: "News" })),
        ...(jobs.data ?? []).map((j) => ({ title: j.title, href: `/jobs/${j.slug}`, type: "Jobs" })),
        ...(events.data ?? []).map((e) => ({ title: e.title, href: `/events/${e.slug}`, type: "Events" })),
        ...(learn.data ?? []).map((l) => ({ title: l.title, href: `/learn/${l.slug}`, type: "Learn" })),
        ...(caseStudies.data ?? []).map((c) => ({ title: c.title, href: `/case-studies/${c.slug}`, type: "Case Studies" })),
        ...(researchPapers.data ?? []).map((r) => ({ title: r.title, href: `/research-papers/${r.slug}`, type: "Research" })),
      ];

      const staticResults: Result[] = staticSearchIndex
        .filter((item) => item.title.toLowerCase().includes(trimmed.toLowerCase()))
        .map((item) => ({ title: item.title, href: item.href, type: "Page" }));

      setResults([...dynamicResults, ...staticResults]);
    }, 250);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search..."
        className="border border-gray-300 rounded px-3 py-1.5 text-sm w-48"
      />

      {open && query.trim().length >= 2 && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded shadow-lg z-50 max-h-96 overflow-y-auto">
          {results.length === 0 ? (
            <p className="text-sm text-gray-400 px-4 py-3">No results found.</p>
          ) : (
            <ul>
              {results.map((r, i) => (
                <li key={i}>
                  <Link
                    href={r.href}
                    onClick={() => {
                      setOpen(false);
                      setQuery("");
                    }}
                    className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 text-sm"
                  >
                    <span>{r.title}</span>
                    <span className="text-xs text-gray-400">{r.type}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}