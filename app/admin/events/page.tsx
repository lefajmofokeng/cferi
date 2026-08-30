import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import "./adminEvents.css";

export default async function AdminEventsPage() {
  const supabase = await createClient();

  const { data: events, error } = await supabase
    .from("events")
    .select("id, title, starts_at, status, updated_at")
    .order("starts_at", { ascending: false });

  if (error) {
    return (
      <main className="g-console">
        
        <div className="g-console__error" role="alert">
          <svg className="g-console__error-icon" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          <span>Failed to load events: {error.message}</span>
        </div>
      </main>
    );
  }

  return (
    <main className="g-console">

      {/* Top Console Header */}
      <header className="g-console__header">
        <nav aria-label="Breadcrumb" className="g-console__breadcrumb">
          <span className="g-console__breadcrumb-link">Content</span>
          <span className="g-console__breadcrumb-sep" aria-hidden="true">/</span>
          <span className="g-console__breadcrumb-active" aria-current="page">Events</span>
        </nav>
        <div className="g-console__title-row">
          <h1 className="g-console__title">Events Manager</h1>
          <Link href="/admin/events/new" className="g-console__btn-primary">
            <svg className="g-console__btn-icon" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
            <span>New Event</span>
          </Link>
        </div>
      </header>

      {/* Main Table Panel Container */}
      <section className="g-console__card">
        <div className="g-console__card-toolbar">
          <span className="g-console__card-count">
            All Scheduled Events ({events.length})
          </span>
        </div>

        {events.length === 0 ? (
          <div className="g-console__empty">
            <div className="g-console__empty-avatar">
              <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
              </svg>
            </div>
            <p className="g-console__empty-headline">No events found</p>
            <p className="g-console__empty-sub">
              Get started by adding a new event above.
            </p>
          </div>
        ) : (
          <div className="g-console__table-container">
            <table className="g-console__table">
              <thead>
                <tr>
                  <th scope="col" className="g-console__th">Event Title</th>
                  <th scope="col" className="g-console__th">Start Date & Time</th>
                  <th scope="col" className="g-console__th">Status</th>
                  <th scope="col" className="g-console__th g-console__th--right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => {
                  const isPublished = event.status === "published";
                  const isCancelled = event.status === "cancelled";

                  let chipStyleClass = "g-console__chip--draft";
                  let dotStyleClass = "g-console__chip-dot--draft";

                  if (isPublished) {
                    chipStyleClass = "g-console__chip--published";
                    dotStyleClass = "g-console__chip-dot--published";
                  } else if (isCancelled) {
                    chipStyleClass = "g-console__chip--cancelled";
                    dotStyleClass = "g-console__chip-dot--cancelled";
                  }

                  return (
                    <tr key={event.id} className="g-console__tr">
                      <td className="g-console__td g-console__td--title">
                        {event.title}
                      </td>
                      <td className="g-console__td g-console__td--date">
                        {new Date(event.starts_at).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="g-console__td">
                        <span className={`g-console__chip ${chipStyleClass}`}>
                          <span
                            className={`g-console__chip-dot ${dotStyleClass}`}
                            aria-hidden="true"
                          />
                          {event.status}
                        </span>
                      </td>
                      <td className="g-console__td g-console__td--right">
                        <Link
                          href={`/admin/events/${event.id}/edit`}
                          className="g-console__action-btn"
                          aria-label={`Edit ${event.title}`}
                        >
                          <span>Edit</span>
                          <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                          </svg>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}