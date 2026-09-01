"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import NotesDrawer from "./drawers/NotesDrawer";
import ContactsDrawer from "./drawers/ContactsDrawer";
import TasksDrawer from "./drawers/TasksDrawer";
import FilesDrawer from "./drawers/FilesDrawer";
import { usePathname } from "next/navigation";
import "./QuickActionsRail.css";

type ToolKey = "notes" | "contacts" | "tasks" | "files" | null;

interface ToolConfig {
  key: Exclude<ToolKey, null>;
  label: string;
  icon: React.ReactNode;
}

const tools: ToolConfig[] = [
  {
    key: "notes",
    label: "Notes",
    icon: (
      <svg className="quick-actions-rail__icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 18h12v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
      </svg>
    ),
  },
  {
    key: "contacts",
    label: "Contacts",
    icon: (
      <svg className="quick-actions-rail__icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    ),
  },
  {
    key: "tasks",
    label: "Tasks",
    icon: (
      <svg className="quick-actions-rail__icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    ),
  },
  {
    key: "files",
    label: "Files",
    icon: (
      <svg className="quick-actions-rail__icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
      </svg>
    ),
  },
];

interface QuickActionsRailProps {
  id?: string;
}

export default function QuickActionsRail({ id = "quick-actions-rail" }: QuickActionsRailProps) {
  const [openTool, setOpenTool] = useState<ToolKey>(null);
  const [dueTaskCount, setDueTaskCount] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function loadDueCount() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { count } = await supabase
        .from("personal_tasks")
        .select("id", { count: "exact", head: true })
        .eq("admin_id", user.id)
        .eq("is_done", false)
        .lte("due_at", new Date().toISOString());

      setDueTaskCount(count ?? 0);
    }

    loadDueCount();

    const channel = supabase
      .channel(`task-badge-${crypto.randomUUID()}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "personal_tasks" },
        loadDueCount
      )
      .subscribe();

    const interval = setInterval(loadDueCount, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  const pathname = usePathname();
  if (pathname === "/admin/login") return null;

  return (
    <>
      <aside
        id={id}
        className={`quick-actions-rail ${
          isCollapsed ? "quick-actions-rail--collapsed" : ""
        }`}
      >
        <button
          type="button"
          onClick={() => setIsCollapsed(false)}
          className="quick-actions-rail__toggle-handle"
          aria-label="Expand actions rail"
        >
          <svg className="quick-actions-rail__icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>

        <div className="quick-actions-rail__tools">
          {tools.map((tool) => {
            const isActive = openTool === tool.key;
            return (
              <button
                key={tool.key}
                onClick={() => setOpenTool(isActive ? null : tool.key)}
                title={tool.label}
                className={`quick-actions-rail__button ${
                  isActive ? "quick-actions-rail__button--active" : ""
                }`}
              >
                {tool.icon}
                {tool.key === "tasks" && dueTaskCount > 0 && (
                  <span className="quick-actions-rail__badge">
                    {dueTaskCount > 9 ? "9+" : dueTaskCount}
                  </span>
                )}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setIsCollapsed(true)}
            className="quick-actions-rail__hide-btn"
            aria-label="Hide toolbar"
          >
            <svg className="quick-actions-rail__icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
              <path d="M2 2l20 20-1.41 1.41L1.59 3.41z" />
            </svg>
            <span className="quick-actions-rail__hide-label">Hide</span>
          </button>
        </div>
      </aside>

      {openTool && (
        <>
          <div
            className="quick-actions-rail__backdrop"
            onClick={() => setOpenTool(null)}
          />
          <div className="quick-actions-rail__drawer">
            <div className="quick-actions-rail__drawer-header">
              <h3 className="quick-actions-rail__drawer-title">
                {tools.find((t) => t.key === openTool)?.label}
              </h3>
              <button
                type="button"
                onClick={() => setOpenTool(null)}
                className="quick-actions-rail__close-btn"
                aria-label="Close panel"
              >
                <svg className="quick-actions-rail__close-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>
            <div className="quick-actions-rail__drawer-content">
              {openTool === "notes" && <NotesDrawer />}
              {openTool === "contacts" && <ContactsDrawer />}
              {openTool === "tasks" && <TasksDrawer />}
              {openTool === "files" && <FilesDrawer />}
            </div>
          </div>
        </>
      )}
    </>
  );
}