"use client";

import Link from "next/link";
import "./AdminDashboard.css";

export default function AdminDashboardPage() {
  return (
    <main className="admin-dashboard">
      {/* Hero / Welcome Banner */}
      <section className="admin-dashboard__hero">
        <div className="admin-dashboard__hero-content">
          <span className="admin-dashboard__badge">Console Overview</span>
          <h1 className="admin-dashboard__title">Welcome back, Admin</h1>
          <p className="admin-dashboard__subtitle">
            Manage your personal workspace, keep track of tasks, store essential files, and maintain direct contact records—all in one place.
          </p>
          <div className="admin-dashboard__hero-actions">
            <a href="#quick-tools" className="admin-dashboard__btn admin-dashboard__btn--primary">
              Explore Tools
            </a>
            <a href="#whats-new" className="admin-dashboard__btn admin-dashboard__btn--secondary">
              What&apos;s New
            </a>
          </div>
        </div>
      </section>

      {/* Quick Launch Cards (Firebase Console Grid style) */}
      <section id="quick-tools" className="admin-dashboard__section">
        <div className="admin-dashboard__section-header">
          <h2 className="admin-dashboard__section-title">Your Workspace Tools</h2>
          <p className="admin-dashboard__section-desc">Quick shortcuts to your active personal utilities.</p>
        </div>

        <div className="admin-dashboard__grid">
          {/* Notes Card */}
          <div className="admin-dashboard__card">
            <div className="admin-dashboard__card-icon admin-dashboard__card-icon--amber">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
              </svg>
            </div>
            <h3 className="admin-dashboard__card-title">Personal Notes</h3>
            <p className="admin-dashboard__card-text">
              Jot down quick thoughts, ideas, or reminders instantly with inline save and updates.
            </p>
            <a href="#notes-drawer" className="admin-dashboard__card-link">
              Open Notes &rarr;
            </a>
          </div>

          {/* Tasks Card */}
          <div className="admin-dashboard__card">
            <div className="admin-dashboard__card-icon admin-dashboard__card-icon--blue">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <h3 className="admin-dashboard__card-title">Tasks & Schedule</h3>
            <p className="admin-dashboard__card-text">
              Track to-dos with due dates, view overdue alerts, or navigate using the month calendar.
            </p>
            <a href="#tasks-drawer" className="admin-dashboard__card-link">
              View Calendar & Tasks &rarr;
            </a>
          </div>

          {/* Files Card */}
          <div className="admin-dashboard__card">
            <div className="admin-dashboard__card-icon admin-dashboard__card-icon--emerald">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
              </svg>
            </div>
            <h3 className="admin-dashboard__card-title">Cloud Storage</h3>
            <p className="admin-dashboard__card-text">
              Upload documents, PDFs, or spreadsheets safely to Supabase Storage with secure links.
            </p>
            <a href="#files-drawer" className="admin-dashboard__card-link">
              Manage Files &rarr;
            </a>
          </div>

          {/* Contacts Card */}
          <div className="admin-dashboard__card">
            <div className="admin-dashboard__card-icon admin-dashboard__card-icon--purple">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <h3 className="admin-dashboard__card-title">Contacts Directory</h3>
            <p className="admin-dashboard__card-text">
              Keep important contacts, phone numbers, email addresses, and physical locations organized.
            </p>
            <a href="#contacts-drawer" className="admin-dashboard__card-link">
              Open Directory &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* Feature Announcement / Marketing Banner */}
      <section id="whats-new" className="admin-dashboard__promo">
        <div className="admin-dashboard__promo-badge">Feature Spotlight</div>
        <div className="admin-dashboard__promo-content">
          <div className="admin-dashboard__promo-text">
            <h2>New Horizontal Calendar & Extended Workspace Drawers</h2>
            <p>
              We&apos;ve upgraded your Admin Console! Switch seamlessly between list view and horizontal month navigation on your Tasks panel, upload critical documents directly to cloud storage, and access all your tools via the Quick Action Rail without losing focus on your screen.
            </p>
            <ul className="admin-dashboard__promo-features">
              <li>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                <span><strong>Horizontal Calendar Navigation:</strong> Browse upcoming months effortlessly with left/right controls.</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                <span><strong>Cloud File Vault:</strong> Store PDFs, docs, and spreadsheets with temporary signed viewing URLs.</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                <span><strong>Sharp Quick Rail:</strong> Quick Action Rail stays crisp while background content blurs for enhanced focus.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}