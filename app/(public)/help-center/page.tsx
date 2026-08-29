export default function HelpCenterPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        color: "#0f172a",
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* 1200px TEXT & GRID CONTENT */}
      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "6rem 2rem 5rem",
        }}
      >
        {/* HERO TITLE */}
        <h1
          style={{
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            fontWeight: 600,
            letterSpacing: "-0.03em",
            marginBottom: "4rem",
            color: "#0f172a",
          }}
        >
          How can we help?
        </h1>

        {/* SUPPORT CARDS / COLUMNS GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "2.5rem 2rem",
          }}
        >
          {/* IT SUPPORT */}
          <section id="it-support" style={{ scrollMarginTop: "6rem" }}>
            <h2
              style={{
                fontSize: "1.125rem",
                fontWeight: 600,
                marginBottom: "0.75rem",
                color: "#0f172a",
              }}
            >
              IT Support
            </h2>
            <p
              style={{
                fontSize: "0.925rem",
                color: "#475569",
                lineHeight: 1.6,
                marginBottom: "1.5rem",
              }}
            >
              Having trouble accessing your account, the admin dashboard, or
              uploading documents?
            </p>
            <a
              href="mailto:it-support@malutitvet.ac.za"
              style={{
                fontSize: "0.925rem",
                fontWeight: 500,
                color: "#0284c7",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              Contact IT Support &gt;
            </a>
          </section>

          {/* GENERAL FAQS */}
          <section id="general-faq" style={{ scrollMarginTop: "6rem" }}>
            <h2
              style={{
                fontSize: "1.125rem",
                fontWeight: 600,
                marginBottom: "0.75rem",
                color: "#0f172a",
              }}
            >
              General FAQs
            </h2>
            <p
              style={{
                fontSize: "0.925rem",
                color: "#475569",
                lineHeight: 1.6,
                marginBottom: "1.5rem",
              }}
            >
              Find quick answers to common questions about campus services and portal access.
            </p>
            <a
              href="#general-faq"
              style={{
                fontSize: "0.925rem",
                fontWeight: 500,
                color: "#0284c7",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              Read FAQs &gt;
            </a>
          </section>

          {/* STUDENT ADMISSIONS */}
          <section id="admissions" style={{ scrollMarginTop: "6rem" }}>
            <h2
              style={{
                fontSize: "1.125rem",
                fontWeight: 600,
                marginBottom: "0.75rem",
                color: "#0f172a",
              }}
            >
              Admissions
            </h2>
            <p
              style={{
                fontSize: "0.925rem",
                color: "#475569",
                lineHeight: 1.6,
                marginBottom: "1.5rem",
              }}
            >
              Get assistance with registration, course requirements, and student application status.
            </p>
            <a
              href="mailto:admissions@malutitvet.ac.za"
              style={{
                fontSize: "0.925rem",
                fontWeight: 500,
                color: "#0284c7",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              Contact Admissions &gt;
            </a>
          </section>

          {/* CAMPUS SERVICES */}
          <section id="campus-services" style={{ scrollMarginTop: "6rem" }}>
            <h2
              style={{
                fontSize: "1.125rem",
                fontWeight: 600,
                marginBottom: "0.75rem",
                color: "#0f172a",
              }}
            >
              Campus Services
            </h2>
            <p
              style={{
                fontSize: "0.925rem",
                color: "#475569",
                lineHeight: 1.6,
                marginBottom: "1.5rem",
              }}
            >
              Inquire about campus resources, incubator facilities, and student housing options.
            </p>
            <a
              href="mailto:info@malutitvet.ac.za"
              style={{
                fontSize: "0.925rem",
                fontWeight: 500,
                color: "#0284c7",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              Inquire Services &gt;
            </a>
          </section>
        </div>
      </main>

      {/* 100% FULL-WIDTH FEATURED IMAGE */}
      <div style={{ width: "100vw", overflow: "hidden" }}>
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80"
          alt="Support Center"
          style={{
            width: "100%",
            height: "auto",
            maxHeight: "550px",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>
    </div>
  );
}