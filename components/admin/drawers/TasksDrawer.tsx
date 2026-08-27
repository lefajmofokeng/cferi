"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Task = {
  id: string;
  title: string;
  due_at: string | null;
  is_done: boolean;
};

export default function TasksDrawer() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState<"list" | "calendar">("list");

  async function loadTasks() {
    const supabase = createClient();
    const { data } = await supabase
      .from("personal_tasks")
      .select("id, title, due_at, is_done")
      .order("due_at", { ascending: true, nullsFirst: false });
    setTasks(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function handleAdd() {
    if (!title.trim()) return;
    setSaving(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("personal_tasks").insert({
      admin_id: user.id,
      title: title.trim(),
      due_at: dueAt ? new Date(dueAt).toISOString() : null,
    });

    setTitle("");
    setDueAt("");
    await loadTasks();
    setSaving(false);
  }

  const today = new Date();
const monthsToShow = Array.from({ length: 6 }, (_, i) => {
  const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
  return { year: d.getFullYear(), month: d.getMonth() };
});

  async function handleToggleDone(id: string, isDone: boolean) {
    const supabase = createClient();
    await supabase.from("personal_tasks").update({ is_done: !isDone }).eq("id", id);
    await loadTasks();
  }

  async function handleDelete(id: string) {
    const supabase = createClient();
    await supabase.from("personal_tasks").delete().eq("id", id);
    await loadTasks();
  }

  function getTasksForDate(date: Date) {
  return tasks.filter((task) => {
    if (!task.due_at) return false;
    const taskDate = new Date(task.due_at);
    return (
      taskDate.getFullYear() === date.getFullYear() &&
      taskDate.getMonth() === date.getMonth() &&
      taskDate.getDate() === date.getDate()
    );
  });
}

function generateMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: (Date | null)[] = [];

  // Pad the start so the grid aligns to the correct weekday column.
  for (let i = 0; i < firstDay.getDay(); i++) {
    days.push(null);
  }
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }
  return days;
}

  const isOverdue = (task: Task) =>
    !task.is_done && task.due_at && new Date(task.due_at) <= new Date();

  if (loading) return <p className="text-gray-400 text-sm">Loading...</p>;

  return (
  <div className="space-y-4">
    <div className="flex gap-2 text-sm">
      <button
        onClick={() => setView("list")}
        className={`px-3 py-1 rounded ${view === "list" ? "bg-black text-white" : "bg-gray-100 text-gray-600"}`}
      >
        List
      </button>
      <button
        onClick={() => setView("calendar")}
        className={`px-3 py-1 rounded ${view === "calendar" ? "bg-black text-white" : "bg-gray-100 text-gray-600"}`}
      >
        Calendar
      </button>
    </div>

    <div className="border border-gray-200 rounded p-3 space-y-2">
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
        />
        <input
          type="datetime-local"
          value={dueAt}
          onChange={(e) => setDueAt(e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
        />
                <button
          onClick={handleAdd}
          disabled={saving}
          className="bg-black text-white px-4 py-1.5 rounded text-sm hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Add Task"}
        </button>
      </div>

      {view === "calendar" ? (
        <div className="space-y-6 max-h-[500px] overflow-y-auto">
          {monthsToShow.map(({ year, month }) => {
            const days = generateMonthDays(year, month);
            const monthLabel = new Date(year, month, 1).toLocaleDateString(undefined, {
              month: "long",
              year: "numeric",
            });

            return (
              <div key={`${year}-${month}`}>
                <p className="text-sm font-medium mb-2">{monthLabel}</p>
                <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-1">
                  {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                    <span key={i}>{d}</span>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, i) => {
                    if (!day) return <div key={i} />;
                    const dayTasks = getTasksForDate(day);
                    const isToday =
                      day.toDateString() === today.toDateString();

                    return (
                      <div
                        key={i}
                        className={`aspect-square flex flex-col items-center justify-center rounded text-xs relative ${
                          isToday ? "bg-black text-white" : "text-gray-700"
                        }`}
                      >
                        <span>{day.getDate()}</span>
                        {dayTasks.length > 0 && (
                          <span
                            className={`absolute bottom-0.5 w-1 h-1 rounded-full ${
                              isToday ? "bg-white" : "bg-red-600"
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
        {tasks.length === 0 ? (
          <p className="text-gray-400 text-sm">No tasks yet.</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`border rounded p-3 text-sm flex items-start gap-2 ${
                isOverdue(task) ? "border-red-300 bg-red-50" : "border-gray-200"
              }`}
            >
              <input
                type="checkbox"
                checked={task.is_done}
                onChange={() => handleToggleDone(task.id, task.is_done)}
                className="mt-1"
              />
              <div className="flex-1">
                <p className={task.is_done ? "line-through text-gray-400" : ""}>
                  {task.title}
                </p>
                {task.due_at && (
                  <p className={`text-xs ${isOverdue(task) ? "text-red-500" : "text-gray-400"}`}>
                    Due {new Date(task.due_at).toLocaleString()}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleDelete(task.id)}
                className="text-gray-300 hover:text-red-600 text-xs"
              >
                ✕
              </button>
            </div>
          ))
                )}
        </div>
      )}
    </div>
  );
}