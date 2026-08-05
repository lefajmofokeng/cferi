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
    .limit(3);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 relative">
        <Link 
          href="/" 
          className="text-lg font-bold tracking-tight text-white flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
          Maluti Incubation Center
        </Link>
        
        <MegaMenuNav learnArticles={learnArticles ?? []} />
      </div>
    </header>
  );
}