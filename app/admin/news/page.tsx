import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import "./adminNews.css";

export default async function AdminNewsPage() {
  const supabase = await createClient();

  const { data: posts, error } = await supabase
    .from("news_posts")
    .select("id, title, status, published_at, updated_at")
    .order("updated_at", { ascending: false });

  if (error) {
    return (
      <main className="g-console">
        <div className="g-console__error" role="alert">
          <svg className="g-console__error-icon" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          <span>Failed to load news: {error.message}</span>
        </div>
      </main>
    );
  }

  return (
    <main className="g-console">
      {/* Header */}
      <header className="g-console__header">
        <nav aria-label="Breadcrumb" className="g-console__breadcrumb">
          <span className="g-console__breadcrumb-link">Content</span>
          <span className="g-console__breadcrumb-sep" aria-hidden="true">/</span>
          <span className="g-console__breadcrumb-active" aria-current="page">News</span>
        </nav>
        <div className="g-console__title-row">
          <h1 className="g-console__title">News Manager</h1>
          <Link href="/admin/news/new" className="g-console__btn-primary">
            <svg className="g-console__btn-icon" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
            <span>New Post</span>
          </Link>
        </div>
      </header>

      {/* Main Table Surface */}
      <section className="g-console__card">
        <div className="g-console__card-toolbar">
          <span className="g-console__card-count">
            All Posts ({posts?.length ?? 0})
          </span>
        </div>

        {!posts || posts.length === 0 ? (
          <div className="g-console__empty">
            <div className="g-console__empty-avatar">
              <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
              </svg>
            </div>
            <p className="g-console__empty-headline">No news posts found</p>
            <p className="g-console__empty-sub">
              Create your first news article using the button above.
            </p>
          </div>
        ) : (
          <div className="g-console__table-container">
            <table className="g-console__table">
              <thead>
                <tr>
                  <th scope="col" className="g-console__th">Title</th>
                  <th scope="col" className="g-console__th">Status</th>
                  <th scope="col" className="g-console__th">Last Updated</th>
                  <th scope="col" className="g-console__th g-console__th--right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => {
                  const isPublished = post.status === "published";

                  return (
                    <tr key={post.id} className="g-console__tr">
                      <td className="g-console__td g-console__td--title">
                        {post.title}
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
                          {post.status}
                        </span>
                      </td>
                      <td className="g-console__td g-console__td--date">
                        {post.updated_at
                          ? new Date(post.updated_at).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="g-console__td g-console__td--right">
                        <Link
                          href={`/admin/news/${post.id}/edit`}
                          className="g-console__action-btn"
                          aria-label={`Edit ${post.title}`}
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