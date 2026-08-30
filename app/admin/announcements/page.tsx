import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminAnnouncementsPage() {
  const supabase = await createClient();

  const { data: announcements, error } = await supabase
    .from("announcements")
    .select("id, title, is_pinned, status, updated_at")
    .order("updated_at", { ascending: false });

  if (error) {
    return (
      <main className="g-console">
        <style>{cssStyles}</style>
        <div className="g-console__error" role="alert">
          <svg className="g-console__error-icon" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          <span>Failed to load announcements: {error.message}</span>
        </div>
      </main>
    );
  }

  return (
    <main className="g-console">
      <style>{cssStyles}</style>

      {/* Top Console Header */}
      <header className="g-console__header">
        <nav aria-label="Breadcrumb" className="g-console__breadcrumb">
          <span className="g-console__breadcrumb-link">Content</span>
          <span className="g-console__breadcrumb-sep" aria-hidden="true">/</span>
          <span className="g-console__breadcrumb-active" aria-current="page">Announcements</span>
        </nav>
        <div className="g-console__title-row">
          <h1 className="g-console__title">Announcements Manager</h1>
          <Link href="/admin/announcements/new" className="g-console__btn-primary">
            <svg className="g-console__btn-icon" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
            <span>New Announcement</span>
          </Link>
        </div>
      </header>

      {/* Main Table Panel Container */}
      <section className="g-console__card">
        <div className="g-console__card-toolbar">
          <span className="g-console__card-count">
            All Announcements ({announcements.length})
          </span>
        </div>

        {announcements.length === 0 ? (
          <div className="g-console__empty">
            <div className="g-console__empty-avatar">
              <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
              </svg>
            </div>
            <p className="g-console__empty-headline">No announcements found</p>
            <p className="g-console__empty-sub">
              Create your first announcement using the button above.
            </p>
          </div>
        ) : (
          <div className="g-console__table-container">
            <table className="g-console__table">
              <thead>
                <tr>
                  <th scope="col" className="g-console__th">Title</th>
                  <th scope="col" className="g-console__th">Pinned</th>
                  <th scope="col" className="g-console__th">Status</th>
                  <th scope="col" className="g-console__th">Last Updated</th>
                  <th scope="col" className="g-console__th g-console__th--right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {announcements.map((a) => {
                  const isPublished = a.status === "published";

                  return (
                    <tr key={a.id} className="g-console__tr">
                      <td className="g-console__td g-console__td--title">
                        {a.title}
                      </td>
                      <td className="g-console__td">
                        {a.is_pinned ? (
                          <span className="g-console__chip g-console__chip--pinned">
                            <svg className="g-console__pinned-icon" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z" />
                            </svg>
                            Pinned
                          </span>
                        ) : (
                          <span className="g-console__dash">—</span>
                        )}
                      </td>
                      <td className="g-console__td">
                        <span
                          className={`g-console__chip ${
                            isPublished
                              ? "g-console__chip--published"
                              : "g-console__chip--draft"
                          }`}
                        >
                          <span
                            className={`g-console__chip-dot ${
                              isPublished
                                ? "g-console__chip-dot--published"
                                : "g-console__chip-dot--draft"
                            }`}
                            aria-hidden="true"
                          />
                          {a.status}
                        </span>
                      </td>
                      <td className="g-console__td g-console__td--date">
                        {new Date(a.updated_at).toLocaleDateString()}
                      </td>
                      <td className="g-console__td g-console__td--right">
                        <Link
                          href={`/admin/announcements/${a.id}/edit`}
                          className="g-console__action-btn"
                          aria-label={`Edit ${a.title}`}
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

const cssStyles = `
  .g-console {
    max-width: 100%;
    margin: 0 auto;
    padding: 2rem 1.5rem;
    font-family: inherit;
    color: #1f1f1f;
    background-color: #f8f9fa;
    min-height: 100vh;
    box-sizing: border-box;
  }

  .g-console *,
  .g-console *::before,
  .g-console *::after {
    box-sizing: inherit;
  }

  .g-console__header {
    margin-bottom: 1.5rem;
  }

  .g-console__breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: #5f6368;
    margin-bottom: 0.5rem;
  }

  .g-console__breadcrumb-sep {
    color: #dadce0;
  }

  .g-console__breadcrumb-active {
    color: #1a73e8;
  }

  .g-console__title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .g-console__title {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 400;
    color: #202124;
    letter-spacing: -0.01em;
  }

  .g-console__btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background-color: #1a73e8;
    color: #ffffff;
    font-size: 0.875rem;
    font-weight: 500;
    padding: 0.5rem 1.25rem;
    border-radius: 9999px;
    text-decoration: none;
    box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15);
    transition: background-color 0.15s ease, box-shadow 0.15s ease;
  }

  .g-console__btn-primary:hover {
    background-color: #1765cc;
    box-shadow: 0 1px 3px 0 rgba(60, 64, 67, 0.3), 0 4px 8px 3px rgba(60, 64, 67, 0.15);
  }

  .g-console__btn-icon {
    width: 1.125rem;
    height: 1.125rem;
  }

  .g-console__card {
    background-color: #ffffff;
    border: 1px solid #dadce0;
    border-radius: 1rem;
    overflow: hidden;
  }

  .g-console__card-toolbar {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid #f1f3f4;
    background-color: #ffffff;
  }

  .g-console__card-count {
    font-size: 0.8125rem;
    font-weight: 500;
    color: #5f6368;
  }

  .g-console__table-container {
    overflow-x: auto;
  }

  .g-console__table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 0.8125rem;
  }

  .g-console__th {
    padding: 0.75rem 1.25rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: #5f6368;
    background-color: #f8f9fa;
    border-bottom: 1px solid #dadce0;
  }

  .g-console__th--right,
  .g-console__td--right {
    text-align: right;
  }

  .g-console__tr {
    border-bottom: 1px solid #f1f3f4;
    transition: background-color 0.12s ease;
  }

  .g-console__tr:last-child {
    border-bottom: none;
  }

  .g-console__tr:hover {
    background-color: #f8f9fa;
  }

  .g-console__td {
    padding: 0.875rem 1.25rem;
    color: #3c4043;
  }

  .g-console__td--title {
    font-weight: 500;
    color: #202124;
    max-width: 22rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .g-console__td--date {
    color: #5f6368;
    font-family: Roboto, sans-serif;
  }

  .g-console__dash {
    color: #bdc1c6;
    font-weight: 500;
  }

  .g-console__chip {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.25rem 0.625rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: capitalize;
  }

  .g-console__chip--pinned {
    background-color: #fef7e0;
    color: #b06000;
  }

  .g-console__pinned-icon {
    width: 0.875rem;
    height: 0.875rem;
    color: #e37400;
  }

  .g-console__chip--published {
    background-color: #e6f4ea;
    color: #137333;
  }

  .g-console__chip--draft {
    background-color: #f1f3f4;
    color: #5f6368;
  }

  .g-console__chip-dot {
    width: 0.375rem;
    height: 0.375rem;
    border-radius: 9999px;
  }

  .g-console__chip-dot--published {
    background-color: #137333;
  }

  .g-console__chip-dot--draft {
    background-color: #5f6368;
  }

  .g-console__action-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    color: #1a73e8;
    font-weight: 500;
    padding: 0.375rem 0.625rem;
    border-radius: 0.25rem;
    text-decoration: none;
    transition: background-color 0.12s ease;
  }

  .g-console__action-btn:hover {
    background-color: #e8f0fe;
  }

  .g-console__action-btn svg {
    width: 1rem;
    height: 1rem;
  }

  .g-console__empty {
    padding: 3.5rem 1.5rem;
    text-align: center;
  }

  .g-console__empty-avatar {
    width: 3.5rem;
    height: 3.5rem;
    background-color: #e8f0fe;
    color: #1a73e8;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem auto;
  }

  .g-console__empty-avatar svg {
    width: 1.75rem;
    height: 1.75rem;
  }

  .g-console__empty-headline {
    margin: 0;
    font-size: 1rem;
    font-weight: 500;
    color: #202124;
  }

  .g-console__empty-sub {
    margin: 0.25rem 0 0 0;
    font-size: 0.8125rem;
    color: #5f6368;
  }

  .g-console__error {
    background-color: #fce8e6;
    border: 1px solid #f2b8b5;
    color: #c5221f;
    padding: 1rem;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8125rem;
  }

  .g-console__error-icon {
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
  }
`;