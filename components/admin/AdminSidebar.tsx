"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

const navigationCategories = [
  {
    title: "Core",
    items: [
      {
        href: "/admin",
        label: "Project Overview",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        ),
      },
    ],
  },
  {
    title: "Content & Publishing",
    items: [
      {
        href: "/admin/news",
        label: "News",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        ),
      },
      {
        href: "/admin/announcements",
        label: "Announcements",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.684A1.76 1.76 0 013 12V8c0-.857.61-1.6 1.455-1.763l12.42-2.385a1.76 1.76 0 012.125 1.724v12.848a1.76 1.76 0 01-2.125 1.724l-11.438-2.2z" />
          </svg>
        ),
      },
      {
        href: "/admin/events",
        label: "Events",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        ),
      },
      {
        href: "/admin/learn",
        label: "Learning Center",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
        ),
      },
      {
        href: "/admin/case-studies",
        label: "Case Studies",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
        ),
      },
    ],
  },
  {
    title: "Recruitment & Intake",
    items: [
      {
        href: "/admin/jobs",
        label: "Job Listings",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        ),
      },
      {
        href: "/admin/applications",
        label: "Applications",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
      },
    ],
  },
  {
    title: "Team & Communication",
    items: [
      {
        href: "/admin/messages",
        label: "Messages",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        ),
      },
      {
        href: "/admin/chat",
        label: "Live Chat",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        ),
      },
      {
        href: "/admin/team",
        label: "Team Members",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ),
      },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [newApplications, setNewApplications] = useState(0);

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

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
  const supabase = createClient();

  async function loadCounts() {
    const { count: msgCount } = await supabase
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("status", "unread");

    const { count: appCount } = await supabase
      .from("incubation_applications")
      .select("id", { count: "exact", head: true })
      .eq("status", "new");

    setUnreadMessages(msgCount ?? 0);
    setNewApplications(appCount ?? 0);
  }

  loadCounts();

  const channel = supabase
    .channel(`sidebar-badges-${crypto.randomUUID()}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "contact_messages" },
      loadCounts
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "incubation_applications" },
      loadCounts
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);


  

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  if (pathname === "/admin/login") return null;
  
  const sidebarContent = (
    <div className="flex flex-col h-full bg-white text-gray-700 font-sans select-none rounded-[15px] border border-gray-200/80 shadow-xs overflow-hidden">
      {/* Header with Maluti Incubation Center Logo Placeholder */}
      <div className="px-4 py-3 flex items-center gap-2.5 border-b border-gray-100">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 border border-dashed border-gray-300 text-gray-500 font-bold text-xs">
          LOGO
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-semibold text-gray-800 leading-tight truncate">
            Maluti Incubation Center
          </span>
          <span className="text-[10px] text-gray-400 font-medium">
            Admin Console
          </span>
        </div>
      </div>

      {/* Main Navigation (Tight spacing to prevent internal scrolling) */}
      <div className="flex-1 px-2.5 py-2 space-y-2.5 overflow-hidden flex flex-col justify-between">
        <div className="space-y-2.5">
          {navigationCategories.map((category, idx) => (
            <div key={category.title}>
              {idx > 0 && <div className="my-1.5 border-t border-gray-100" />}
              <p className="px-2.5 pb-1 text-[10px] font-medium text-gray-400 tracking-wide uppercase">
                {category.title}
              </p>
              <nav className="space-y-0.5">
                {category.items.map((item) => {
  const isActive = pathname === item.href;
  const badgeCount =
    item.href === "/admin/messages"
      ? unreadMessages
      : item.href === "/admin/applications"
      ? newApplications
      : 0;

  return (
    <Link
      key={item.href}
      href={item.href}
      className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-full text-xs transition-colors ${
        isActive
          ? "bg-gray-100 text-gray-900 font-semibold"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium"
      }`}
    >
      <span className={isActive ? "text-gray-900" : "text-gray-400"}>
        {item.icon}
      </span>
      <span className="truncate flex-1">{item.label}</span>
      {badgeCount > 0 && (
        <span className="bg-red-600 text-white text-[10px] font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
          {badgeCount > 9 ? "9+" : badgeCount}
        </span>
      )}
    </Link>
  );
})}
              </nav>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Profile Bar */}
      <div className="p-2 border-t border-gray-100 bg-gray-50/60 mt-auto">
        <div className="flex items-center justify-between px-2 py-0.5">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full bg-slate-800 text-[11px] font-bold text-white">
              {(userName || "Admin").charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-gray-800 truncate leading-tight">
                {userName || "Admin"}
              </span>
              <span className="text-[10px] text-gray-400 truncate">
                Signed in
              </span>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            title="Sign Out"
            className="p-1 text-gray-400 hover:text-red-600 hover:bg-gray-200/50 rounded-full transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden p-[5px] shrink-0">
        <div className="flex items-center justify-between bg-white text-gray-800 px-3.5 py-2.5 rounded-[12px] border border-gray-200">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-gray-100 border border-dashed border-gray-300 text-[9px] font-bold text-gray-500">
              LOGO
            </div>
            <span className="text-xs font-semibold text-gray-800 truncate">
              Maluti Console
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1 rounded-lg text-gray-600 hover:bg-gray-100"
            aria-label="Toggle navigation"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/40 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 p-[5px] transform transition-transform duration-200 ease-in-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop Floating Sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 h-screen p-[5px] sticky top-0">
        {sidebarContent}
      </aside>
    </>
  );
}