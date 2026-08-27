"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Notification = {
  id: string;
  type: "application" | "message";
  title: string;
  href: string;
  createdAt: string;
};

export default function NotificationBell() {
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
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 rounded hover:bg-gray-100"
      >
        🔔
        {notifications.length > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
            {notifications.length > 9 ? "9+" : notifications.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded shadow-lg z-50 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-sm text-gray-400 px-4 py-4 text-center">
              No new notifications.
            </p>
          ) : (
            <ul>
              {notifications.map((n) => (
                <li key={`${n.type}-${n.id}`}>
                  <Link
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 text-sm"
                  >
                    <p className="text-gray-900">{n.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
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