"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import "./TasksDrawer.css";

type Task = {
  id: string;
  title: string;
  due_at: string | null;
  is_done: boolean;
};

interface TasksDrawerProps {
  id?: string;
}

export default function TasksDrawer({ id = "tasks-drawer" }: TasksDrawerProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState<"list" | "calendar">("list");
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(0);

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

  if (loading) {
    return (
      <section id={id} className="tasks-drawer">
        <p className="tasks-drawer__loading">Loading...</p>
      </section>
    );
  }

  const activeMonth = monthsToShow[selectedMonthIndex];
  const activeMonthDays = generateMonthDays(activeMonth.year, activeMonth.month);
  const activeMonthLabel = new Date(activeMonth.year, activeMonth.month, 1).toLocaleDateString(
    undefined,
    {
      month: "long",
      year: "numeric",
    }
  );

  return (
    <section id={id} className="tasks-drawer">
      {/* View Switcher Toggle */}
      <div className="tasks-drawer__view-toggle">
        <button
          type="button"
          onClick={() => setView("list")}
          className={`tasks-drawer__toggle-btn ${
            view === "list" ? "tasks-drawer__toggle-btn--active" : ""
          }`}
        >
          <svg className="tasks-drawer__btn-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
          </svg>
          <span>List</span>
        </button>
        <button
          type="button"
          onClick={() => setView("calendar")}
          className={`tasks-drawer__toggle-btn ${
            view === "calendar" ? "tasks-drawer__toggle-btn--active" : ""
          }`}
        >
          <svg className="tasks-drawer__btn-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
          </svg>
          <span>Calendar</span>
        </button>
      </div>

      {/* Task Creation Form */}
      <div className="tasks-drawer__form">
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="tasks-drawer__input"
        />
        <input
          type="datetime-local"
          value={dueAt}
          onChange={(e) => setDueAt(e.target.value)}
          className="tasks-drawer__input"
        />
        <div className="tasks-drawer__form-actions">
          <button
            type="button"
            onClick={handleAdd}
            disabled={saving || !title.trim()}
            className="tasks-drawer__add-btn"
          >
            <svg className="tasks-drawer__btn-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
            <span>{saving ? "Saving..." : "Add Task"}</span>
          </button>
        </div>
      </div>

      {/* Main Content View */}
      {view === "calendar" ? (
        <div className="tasks-drawer__calendar">
          {/* Horizontal Navigation Header */}
          <div className="tasks-drawer__calendar-nav">
            <p className="tasks-drawer__month-title">{activeMonthLabel}</p>
            <div className="tasks-drawer__nav-actions">
              <button
                type="button"
                onClick={() => setSelectedMonthIndex((prev) => Math.max(0, prev - 1))}
                disabled={selectedMonthIndex === 0}
                aria-label="Previous month"
                className="tasks-drawer__nav-btn"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() =>
                  setSelectedMonthIndex((prev) =>
                    Math.min(monthsToShow.length - 1, prev + 1)
                  )
                }
                disabled={selectedMonthIndex === monthsToShow.length - 1}
                aria-label="Next month"
                className="tasks-drawer__nav-btn"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="tasks-drawer__month-container">
            <div className="tasks-drawer__weekdays-grid">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <span key={i} className="tasks-drawer__weekday">
                  {d}
                </span>
              ))}
            </div>
            <div className="tasks-drawer__days-grid">
              {activeMonthDays.map((day, i) => {
                if (!day) return <div key={i} className="tasks-drawer__day-empty" />;
                const dayTasks = getTasksForDate(day);
                const isToday = day.toDateString() === today.toDateString();

                return (
                  <div
                    key={i}
                    className={`tasks-drawer__day ${
                      isToday ? "tasks-drawer__day--today" : ""
                    }`}
                  >
                    <span className="tasks-drawer__day-number">{day.getDate()}</span>
                    {dayTasks.length > 0 && (
                      <span
                        className={`tasks-drawer__day-dot ${
                          isToday ? "tasks-drawer__day-dot--today" : ""
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="tasks-drawer__list">
          {tasks.length === 0 ? (
            <p className="tasks-drawer__empty">No tasks yet.</p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`tasks-drawer__card ${
                  isOverdue(task) ? "tasks-drawer__card--overdue" : ""
                }`}
              >
                <label className="tasks-drawer__checkbox-wrapper">
                  <input
                    type="checkbox"
                    checked={task.is_done}
                    onChange={() => handleToggleDone(task.id, task.is_done)}
                    className="tasks-drawer__checkbox"
                  />
                  <span className="tasks-drawer__custom-checkbox">
                    {task.is_done && (
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    )}
                  </span>
                </label>

                <div className="tasks-drawer__card-content">
                  <p
                    className={`tasks-drawer__card-title ${
                      task.is_done ? "tasks-drawer__card-title--done" : ""
                    }`}
                  >
                    {task.title}
                  </p>
                  {task.due_at && (
                    <p
                      className={`tasks-drawer__card-due ${
                        isOverdue(task) ? "tasks-drawer__card-due--overdue" : ""
                      }`}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                      </svg>
                      <span>Due {new Date(task.due_at).toLocaleString()}</span>
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(task.id)}
                  aria-label="Delete task"
                  title="Delete task"
                  className="tasks-drawer__delete-btn"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}