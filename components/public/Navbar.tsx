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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white shadow-sm">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4 relative">
        <Link 
          href="/" 
          className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <span className="w-3 h-3 rounded-full bg-blue-600 inline-block"></span>
          Maluti Incubation Center
        </Link>
        
        <MegaMenuNav learnArticles={learnArticles ?? []} />
      </div>
    </header>
  );
}