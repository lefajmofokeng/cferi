"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/news", label: "News" },
  { href: "/admin/jobs", label: "Jobs" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/announcements", label: "Announcements" },
  { href: "/admin/learn", label: "Learn" },
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/team", label: "Team" },
  { href: "/admin/chat", label: "Chat" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState("");

useEffect(() => {
  async function loadUser() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("admin_users")
        .select("full_name")
        .eq("id", user.id)
        .single();
      if (data) setUserName(data.full_name);
    }
  }
  loadUser();
}, []);

  // Don't show the sidebar on the login page itself.
  if (pathname === "/admin/login") return null;

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="w-56 shrink-0 border-r border-gray-200 min-h-screen px-4 py-6">
      <p className="font-semibold mb-1">{userName || "Admin"}</p>
<p className="text-xs text-gray-400 mb-6">Signed in</p>
      <nav className="space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-3 py-2 rounded text-sm ${
              pathname === link.href
                ? "bg-gray-100 font-medium"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <button
        onClick={handleSignOut}
        className="mt-8 text-sm text-red-600 hover:underline"
      >
        Sign Out
      </button>
    </aside>
  );
}