import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import MegaMenuNav from "./MegaMenuNav";

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
    <header className="site-header">
      <div className="header-container">
        
        {/* LEFT SECTION: Logo */}
        <div className="header-left">
          <Link href="/" className="brand-link">
            <div className="brand-icon">
              <img src="/images/logo.png" alt="Maluti Incubation Logo" width={40} height={40} />
            </div>
        
          </Link>
        </div>

        {/* CENTER / RIGHT INTERACTIVE NAV (Handles Desktop Links & Mobile Controls) */}
        <MegaMenuNav 
          learnArticles={learnArticles ?? []} 
          caseStudies={caseStudies ?? []} 
        />

        {/* DESKTOP RIGHT SECTION: Action Buttons */}
        <div className="header-right desktop-only">
          <Link href="/contact" className="btn-contact">
            Contact Us
          </Link>
          <Link href="/apply" className="btn-apply">
            Apply for Incubation
          </Link>
        </div>

      </div>
    </header>
  );
}