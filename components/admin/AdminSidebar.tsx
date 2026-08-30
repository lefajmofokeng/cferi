"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import "./AdminSidebar.css";

const navigationCategories = [
  {
    title: "Core",
    items: [
      {
        href: "/admin",
        label: "Project Overview",
        icon: (
          <svg className="admin-sidebar__icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
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
          <svg className="admin-sidebar__icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-9 14H4v-6h7v6zm0-8H4V7h7v3zm9 8h-7V7h7v11z" />
          </svg>
        ),
      },
      {
        href: "/admin/announcements",
        label: "Announcements",
        icon: (
          <svg className="admin-sidebar__icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z" />
          </svg>
        ),
      },
      {
        href: "/admin/events",
        label: "Events",
        icon: (
          <svg className="admin-sidebar__icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
          </svg>
        ),
      },
      {
        href: "/admin/learn",
        label: "Learning Center",
        icon: (
          <svg className="admin-sidebar__icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
          </svg>
        ),
      },
      {
        href: "/admin/case-studies",
        label: "Case Studies",
        icon: (
          <svg className="admin-sidebar__icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
          </svg>
        ),
      },
      {
        href: "/admin/research-papers",
        label: "Research Papers",
        icon: (
          <svg className="admin-sidebar__icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
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
          <svg className="admin-sidebar__icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
          </svg>
        ),
      },
      {
        href: "/admin/applications",
        label: "Applications",
        icon: (
          <svg className="admin-sidebar__icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
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
          <svg className="admin-sidebar__icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
          </svg>
        ),
      },
      {
        href: "/admin/feedback",
        label: "Site Feedback",
        icon: (
          <svg className="admin-sidebar__icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM13 14h-2v-2h2v2zm0-4h-2V6h2v4z" />
          </svg>
        ),
      },
      {
        href: "/admin/chat",
        label: "Live Chat",
        icon: (
          <svg className="admin-sidebar__icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
          </svg>
        ),
      },
      {
        href: "/admin/team",
        label: "Team Members",
        icon: (
          <svg className="admin-sidebar__icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
          </svg>
        ),
      },
    ],
  },
];

interface AdminSidebarProps {
  id?: string;
}

export default function AdminSidebar({ id = "admin-sidebar" }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [newApplications, setNewApplications] = useState(0);
  const [unreadFeedback, setUnreadFeedback] = useState(0);

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("admin_users")
          .select("full_name, role")
          .eq("id", user.id)
          .single();
        if (data) {
          setUserName(data.full_name);
          setRole(data.role);
        }
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

      const { count: feedbackCount } = await supabase
        .from("site_feedback")
        .select("id", { count: "exact", head: true })
        .eq("is_read", false);

      setUnreadMessages(msgCount ?? 0);
      setNewApplications(appCount ?? 0);
      setUnreadFeedback(feedbackCount ?? 0);
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
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_feedback" },
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
    <div className="admin-sidebar__content">
      {/* Header */}
      <div className="admin-sidebar__header">
        <div className="admin-sidebar__logo">
          LOGO
        </div>
        <div className="admin-sidebar__brand">
          <span className="admin-sidebar__brand-title">
            Maluti Incubation Center
          </span>
          <span className="admin-sidebar__brand-subtitle">
            Admin Console
          </span>
        </div>
      </div>

      {/* Main Navigation List */}
      <div className="admin-sidebar__nav-container">
        {navigationCategories.map((category, idx) => (
          <div key={category.title}>
            {idx > 0 && <div className="admin-sidebar__divider" />}
            <p className="admin-sidebar__category-title">
              {category.title}
            </p>
            <nav className="admin-sidebar__nav">
              {category.items.map((item) => {
                const isActive = pathname === item.href;
                const badgeCount =
                  item.href === "/admin/messages"
                    ? unreadMessages
                    : item.href === "/admin/applications"
                    ? newApplications
                    : item.href === "/admin/feedback"
                    ? unreadFeedback
                    : 0;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`admin-sidebar__link ${
                      isActive ? "admin-sidebar__link--active" : ""
                    }`}
                  >
                    <span className={`admin-sidebar__icon-wrapper ${isActive ? "admin-sidebar__icon-wrapper--active" : ""}`}>
                      {item.icon}
                    </span>
                    <span className="admin-sidebar__link-label">{item.label}</span>
                    {badgeCount > 0 && (
                      <span className="admin-sidebar__badge">
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

      {/* Profile Footer */}
      <div className="admin-sidebar__footer">
        <div className="admin-sidebar__profile">
          <div className="admin-sidebar__user-info">
            <div className="admin-sidebar__user-info">
              <div className="admin-sidebar__avatar">
                {(userName || "Admin").charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            title="Sign Out"
            className="admin-sidebar__signout-btn"
          >
            <svg
              className="admin-sidebar__signout-icon"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <section id={id} className="admin-sidebar-wrapper">
      {/* Mobile Header Bar */}
      <div className="admin-sidebar__mobile-bar">
        <div className="admin-sidebar__mobile-bar-inner">
          <div className="admin-sidebar__mobile-bar-inner">
            <div className="admin-sidebar__mobile-brand">
              <div className="admin-sidebar__mobile-logo">
                LOGO
              </div>
              <span className="admin-sidebar__mobile-title">
                Maluti Console
              </span>
            </div>

            <div className="admin-sidebar__mobile-right">
              <div className="admin-sidebar__mobile-profile">
                <div className="admin-sidebar__mobile-avatar">
                  {(userName || "Admin").charAt(0).toUpperCase()}
                </div>
                <div className="admin-sidebar__mobile-user-details">
                  <span className="admin-sidebar__mobile-user-name">
                    {userName || "Admin"}
                  </span>
                  {role && (
                    <span className="admin-sidebar__mobile-user-role">
                      {role.replace("_", " ")}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="admin-sidebar__mobile-toggle"
                aria-label="Toggle navigation"
              >
                <svg className="admin-sidebar__toggle-icon" viewBox="0 0 24 24" fill="currentColor">
                  {mobileOpen ? (
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  ) : (
                    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                  )}
                </svg>
              </button></div>
            </div>
          </div>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="admin-sidebar__overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`admin-sidebar__drawer ${
          mobileOpen ? "admin-sidebar__drawer--open" : ""
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop Sidebar */}
      <aside className="admin-sidebar__desktop">
        {sidebarContent}
      </aside>
    </section>
  );
}