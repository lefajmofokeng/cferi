"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import NotesDrawer from "./drawers/NotesDrawer";
import ContactsDrawer from "./drawers/ContactsDrawer";
import TasksDrawer from "./drawers/TasksDrawer";
import FilesDrawer from "./drawers/FilesDrawer";

type ToolKey = "notes" | "contacts" | "tasks" | "files" | null;

const tools: { key: Exclude<ToolKey, null>; icon: string; label: string }[] = [
  { key: "notes", icon: "📝", label: "Notes" },
  { key: "contacts", icon: "👤", label: "Contacts" },
  { key: "tasks", icon: "✅", label: "Tasks" },
  { key: "files", icon: "📁", label: "Files" },
];

export default function QuickActionsRail() {
  const [openTool, setOpenTool] = useState<ToolKey>(null);
  const [dueTaskCount, setDueTaskCount] = useState(0);

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

  return (
    <>
      <aside className="fixed right-0 top-0 h-screen w-14 border-l border-gray-200 bg-white flex flex-col items-center py-6 gap-4 z-30">
        {tools.map((tool) => (
          <button
            key={tool.key}
            onClick={() => setOpenTool(tool.key)}
            title={tool.label}
            className={`relative w-10 h-10 rounded-lg flex items-center justify-center text-lg hover:bg-gray-100 ${
              openTool === tool.key ? "bg-gray-100" : ""
            }`}
          >
            {tool.icon}
            {tool.key === "tasks" && dueTaskCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-semibold rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-1">
                {dueTaskCount > 9 ? "9+" : dueTaskCount}
              </span>
            )}
          </button>
        ))}
      </aside>

      {openTool && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setOpenTool(null)}
          />
          <div className="fixed right-0 top-0 h-screen w-96 bg-white border-l border-gray-200 shadow-lg z-50 flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <p className="font-medium">
                {tools.find((t) => t.key === openTool)?.label}
              </p>
              <button
                onClick={() => setOpenTool(null)}
                className="text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
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