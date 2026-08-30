"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import "./NotificationBell.css";

type Notification = {
  id: string;
  type: "application" | "message";
  title: string;
  href: string;
  createdAt: string;
};

interface NotificationBellProps {
  id?: string;
}

export default function NotificationBell({ id = "notification-bell" }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
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
    const supabase = createClient();

    async function loadInitialCounts() {
      const { data: newApplications } = await supabase
        .from("incubation_applications")
        .select("id, full_name, submitted_at")
        .eq("status", "new")
        .order("submitted_at", { ascending: false })
        .limit(10);

      const { data: unreadMessages } = await supabase
        .from("contact_messages")
        .select("id, name, submitted_at")
        .eq("status", "unread")
        .order("submitted_at", { ascending: false })
        .limit(10);

      const initial: Notification[] = [
        ...(newApplications ?? []).map((a) => ({
          id: a.id,
          type: "application" as const,
          title: `New application from ${a.full_name}`,
          href: `/admin/applications/${a.id}`,
          createdAt: a.submitted_at,
        })),
        ...(unreadMessages ?? []).map((m) => ({
          id: m.id,
          type: "message" as const,
          title: `New message from ${m.name}`,
          href: `/admin/messages/${m.id}`,
          createdAt: m.submitted_at,
        })),
      ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setNotifications(initial);
    }

    loadInitialCounts();

    const channel = supabase
      .channel(`admin-notifications-${crypto.randomUUID()}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "incubation_applications" },
        (payload) => {
          const app = payload.new as { id: string; full_name: string; submitted_at: string };
          setNotifications((prev) => [
            {
              id: app.id,
              type: "application",
              title: `New application from ${app.full_name}`,
              href: `/admin/applications/${app.id}`,
              createdAt: app.submitted_at,
            },
            ...prev,
          ]);
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "contact_messages" },
        (payload) => {
          const msg = payload.new as { id: string; name: string; submitted_at: string };
          setNotifications((prev) => [
            {
              id: msg.id,
              type: "message",
              title: `New message from ${msg.name}`,
              href: `/admin/messages/${msg.id}`,
              createdAt: msg.submitted_at,
            },
            ...prev,
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <section id={id} ref={containerRef} className="notification-bell">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="notification-bell__button"
        aria-label="Notifications"
        title="Notifications"
      >
        <svg className="notification-bell__icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
        </svg>
        {notifications.length > 0 && (
          <span className="notification-bell__badge">
            {notifications.length > 9 ? "9+" : notifications.length}
          </span>
        )}
      </button>

      {open && (
        <div className="notification-bell__dropdown">
          <div className="notification-bell__header">
            <span className="notification-bell__header-title">Notifications</span>
          </div>

          {notifications.length === 0 ? (
            <div className="notification-bell__empty">
              No new notifications.
            </div>
          ) : (
            <ul className="notification-bell__list">
              {notifications.map((n) => (
                <li key={`${n.type}-${n.id}`} className="notification-bell__item">
                  <Link
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className="notification-bell__link"
                  >
                    <div className="notification-bell__item-icon">
                      {n.type === "application" ? (
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                        </svg>
                      )}
                    </div>
                    <div className="notification-bell__item-content">
                      <p className="notification-bell__item-title">{n.title}</p>
                      <p className="notification-bell__item-time">
                        {new Date(n.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}