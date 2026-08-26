import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import MegaMenuNav from "./MegaMenuNav";
import SiteSearch from "./SiteSearch";

export default async function Navbar() {
  const supabase = await createClient();

  const { data: learnArticles } = await supabase
    .from("learn_articles")
    .select("id, title, slug, cover_image_url")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(2);

  const { data: caseStudies } = await supabase
    .from("case_studies")
    .select("id, title, slug, cover_image_url")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(3);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        
        {/* LEFT SECTION: Logo Placeholder & Main Nav Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white font-bold shadow-md shadow-slate-950/10 group-hover:bg-slate-800 transition-colors">
              {/* Optional: <Image src="/logo.svg" alt="Logo" width={24} height={24} /> */}
              <span className="text-xs tracking-wider">M</span>
            </div>
            <span className="hidden sm:inline-block font-semibold text-slate-900 text-base tracking-tight">
              Maluti<span className="text-sky-500"> Incubation</span>
            </span>
          </Link>

          {/* Client Interactive Navigation Links */}
          <MegaMenuNav 
            learnArticles={learnArticles ?? []} 
            caseStudies={caseStudies ?? []} 
          />
        </div>

        {/* RIGHT SECTION: Search & Action Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <SiteSearch />
          <Link
            href="/contact"
            className="text-sm font-medium text-slate-700 hover:text-slate-950 px-4 py-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            Contact Us
          </Link>
          <Link
            href="/apply"
            className="text-sm font-medium text-white bg-slate-950 hover:bg-slate-800 px-4 py-2 rounded-full transition-all shadow-sm"
          >
            Apply for Incubation
          </Link>
        </div>

      </div>
    </header>
  );
}