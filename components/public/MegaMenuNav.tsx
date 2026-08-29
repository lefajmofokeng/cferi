"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type LearnArticle = {
  id: string;
  title: string;
  slug: string;
  cover_image_url: string | null;
};

type CaseStudy = {
  id: string;
  title: string;
  slug: string;
  cover_image_url: string | null;
};

const menus = {
  programs: {
    label: "Programs",
    columns: [
      {
        heading: "Incubation",
        links: [
          { href: "/business-incubation-programme", label: "Business Incubation", desc: "Lean startup methodologies, business management development, pitching practices, and masterclasses." },
          { href: "/entrepreneurship-training", label: "Entrepreneurship Training", desc: "Intensive operational training modules focused on local scalable frameworks for emerging SMMEs." },
          { href: "/mentorship-programme", label: "Mentorship Program", desc: "Direct deployment of expert corporate mentors to work directly on your unique scaling blockages." },
          { href: "/admin-compliance-support", label: "Admin & Compliance", desc: "Fast-tracked business registrations through CIPC, SARS tax compliance, and robust financial framework setups." },
        ],
      },
      {
        heading: "Support",
        links: [
          { href: "/help-center", label: "Help Center", desc: "FAQs and platform support." },
          { href: "/contact", label: "Contact Operations", desc: "Get in touch with our operations team." },
        ],
      },
    ],
  },
  discover: {
    label: "Discover",
    columns: [
      {
        heading: "Organization",
        links: [
          { href: "/about", label: "About Us", desc: "Learn about our mission statement, vision and team." },
          { href: "/corporate-office", label: "Corporate Office", desc: "Headquarters location and facilities." },
          { href: "/leadership", label: "Leadership", desc: "Meet the team leading our platform." },
        ],
      },
      {
        heading: "Ecosystem",
        links: [
          { href: "/jobs", label: "Job Opportunities", desc: "Join our expanding team and network." },
          { href: "/events", label: "Events Calendar", desc: "Workshops, keynotes, and founder meetups." },
        ],
      },
    ],
  },
  resources: {
    label: "Resources",
    columns: [
      {
        heading: "Knowledge Base",
        links: [
          { href: "/news", label: "News & Insights", desc: "Latest ecosystem updates and press." },
          { href: "/announcements", label: "Announcements", desc: "Official press and platform notices." },
          { href: "/learn", label: "Learn & Guides", desc: "In-depth guides and technical articles." },
        ],
      },
    ],
  },
  marketFunding: {
    label: "Market & Funding",
    columns: [
      {
        heading: "Capital Access",
        links: [
          { href: "/national-grant-structure", label: "National Grants", desc: "Access non-repayable grant capital through SEDA and NYDA pipelines." },
          { href: "/corporate-procurement-connections", label: "Corporate Procurement", desc: "B-BBEE supplier development programs and private manufacturing lines." },
        ],
      },
      {
        heading: "Tenders & Trade",
        links: [
          { href: "/tenders-public-sector-panels", label: "Public Sector Panels", desc: "Frameworks covering compliance and bidding accuracy." },
          { href: "/exhibitions-commercial-trades", label: "Commercial Trade Shows", desc: "Commercial trade exhibitions and enterprise market expansion." },
        ],
      },
    ],
  },
};

type MenuKey = keyof typeof menus;

export default function MegaMenuNav({
  learnArticles,
  caseStudies,
}: {
  learnArticles: LearnArticle[];
  caseStudies: CaseStudy[];
}) {
  const [openMenu, setOpenMenu] = useState<MenuKey | "search" | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<MenuKey | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleMouseEnter = (key: MenuKey) => {
    if (openMenu === "search") return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenMenu(key);
  };

  const handleMouseLeave = () => {
    if (openMenu === "search") return;
    timeoutRef.current = setTimeout(() => {
      setOpenMenu(null);
    }, 150);
  };

  // Build searchable repository with titles, descriptions, categories, and images
  const allSearchableItems = [
    ...Object.values(menus).flatMap((m) =>
      m.columns.flatMap((c) =>
        c.links.map((l) => ({
          href: l.href,
          title: l.label,
          desc: l.desc,
          category: c.heading,
          cover_image_url: null,
        }))
      )
    ),
    ...learnArticles.map((a) => ({
      href: `/learn/${a.slug}`,
      title: a.title,
      desc: "Resource & Guide",
      category: "Learn Article",
      cover_image_url: a.cover_image_url,
    })),
    ...caseStudies.map((c) => ({
      href: `/case-studies/${c.slug}`,
      title: c.title,
      desc: "Incubation Success Story",
      category: "Case Study",
      cover_image_url: c.cover_image_url,
    })),
  ];

  const searchResults = searchQuery.trim()
    ? allSearchableItems.filter(
        (i) =>
          i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.desc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div onMouseLeave={handleMouseLeave}>
      {/* White Tint Backdrop Blur Layer */}
      {openMenu && <div className="menu-backdrop" onClick={() => setOpenMenu(null)} />}

      {/* Desktop Navigation Links */}
      <nav className="nav-list desktop-only">
        {(Object.keys(menus) as MenuKey[]).map((key) => {
          const isOpen = openMenu === key;
          return (
            <button
              key={key}
              type="button"
              onMouseEnter={() => handleMouseEnter(key)}
              onClick={() => setOpenMenu(isOpen ? null : key)}
              className={`nav-item-btn ${isOpen ? "active" : ""}`}
            >
              {menus[key].label}
            </button>
          );
        })}

        {/* Search Icon Trigger Toggle */}
        <button
          type="button"
          onClick={() => {
            setOpenMenu(openMenu === "search" ? null : "search");
            setSearchQuery("");
          }}
          className={`search-toggle-btn ${openMenu === "search" ? "active" : ""}`}
          aria-label="Search site"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </nav>

      {/* Mobile Toggle & Search Action */}
      <div className="mobile-header-right">
        <button
          type="button"
          onClick={() => {
            setOpenMenu(openMenu === "search" ? null : "search");
            setSearchQuery("");
            setMobileOpen(false);
          }}
          className="search-toggle-btn"
          aria-label="Search site"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => {
            setMobileOpen(!mobileOpen);
            setOpenMenu(null);
          }}
          className="mobile-toggle"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Sliding Megamenu Drawer */}
      {openMenu && (
        <div
          onMouseEnter={() => openMenu !== "search" && handleMouseEnter(openMenu as MenuKey)}
          onMouseLeave={handleMouseLeave}
          className="megamenu-drawer"
        >
          <div className="megamenu-inner">
            
            {/* Centered Search Megamenu View */}
            {openMenu === "search" ? (
              <div className="search-megamenu-container">
                <div className="search-input-wrapper">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ask about research"
                    className="search-input-field"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setOpenMenu(null)}
                    className="search-close-btn"
                  >
                    ✕
                  </button>
                </div>

                {/* Real-time Editorial Results Stack */}
                {searchQuery.trim() !== "" && (
                  <div className="search-results-list">
                    {searchResults.length > 0 ? (
                      searchResults.map((item, index) => (
                        <Link
                          key={index}
                          href={item.href}
                          onClick={() => setOpenMenu(null)}
                          className="search-result-item"
                        >
                          <div className="search-result-content">
                            <div className="search-result-meta">
                              <span className="search-result-category">{item.category}</span>
                            </div>
                            <h3 className="search-result-title">{item.title}</h3>
                            {item.desc && <p className="search-result-desc">{item.desc}</p>}
                          </div>

                          {item.cover_image_url && (
                            <div className="search-result-thumbnail">
                              <img src={item.cover_image_url} alt={item.title} />
                            </div>
                          )}
                        </Link>
                      ))
                    ) : (
                      <p style={{ color: "#94a3b8", fontSize: "0.875rem", textAlign: "center", padding: "1rem 0" }}>
                        No results matched "{searchQuery}"
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Navigation Links View */
              <div className="megamenu-grid">
                <div
                  className={
                    (openMenu === "resources" && learnArticles.length > 0) ||
                    (openMenu === "programs" && caseStudies.length > 0)
                      ? "grid-col-split"
                      : "grid-col-wide"
                  }
                >
                  {menus[openMenu as MenuKey].columns.map((column, i) => (
                    <div key={i}>
                      {column.heading && (
                        <span className="column-eyebrow">{column.heading}</span>
                      )}
                      <ul className="mega-links-list">
                        {column.links.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              onClick={() => setOpenMenu(null)}
                              className="mega-link-item"
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Featured Articles / Case Studies Right Rail */}
                {openMenu === "resources" && learnArticles.length > 0 && (
                  <div className="grid-col-featured">
                    <div className="featured-header">
                      <span className="column-eyebrow" style={{ margin: 0 }}>
                        Featured Articles
                      </span>
                      <Link href="/learn" onClick={() => setOpenMenu(null)} className="featured-view-all">
                        View All &rarr;
                      </Link>
                    </div>
                    <div className="featured-grid">
                      {learnArticles.map((article) => (
                        <Link
                          key={article.id}
                          href={`/learn/${article.slug}`}
                          onClick={() => setOpenMenu(null)}
                          className="editorial-card"
                        >
                          <div className="editorial-card-image">
                            {article.cover_image_url ? (
                              <img src={article.cover_image_url} alt={article.title} />
                            ) : (
                              <div className="editorial-placeholder">Maluti Center</div>
                            )}
                          </div>
                          <h3 className="editorial-card-title">{article.title}</h3>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {openMenu === "programs" && caseStudies.length > 0 && (
                  <div className="grid-col-featured">
                    <div className="featured-header">
                      <span className="column-eyebrow" style={{ margin: 0 }}>
                        Case Studies
                      </span>
                      <Link href="/case-studies" onClick={() => setOpenMenu(null)} className="featured-view-all">
                        View All &rarr;
                      </Link>
                    </div>
                    <div className="featured-grid">
                      {caseStudies.map((cs) => (
                        <Link
                          key={cs.id}
                          href={`/case-studies/${cs.slug}`}
                          onClick={() => setOpenMenu(null)}
                          className="editorial-card"
                        >
                          <div className="editorial-card-image">
                            {cs.cover_image_url ? (
                              <img src={cs.cover_image_url} alt={cs.title} />
                            ) : (
                              <div className="editorial-placeholder">Case Study</div>
                            )}
                          </div>
                          <h3 className="editorial-card-title">{cs.title}</h3>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="mobile-drawer">
          <div>
            {(Object.keys(menus) as MenuKey[]).map((key) => {
              const isAccordionOpen = activeAccordion === key;
              return (
                <div key={key} className="mobile-accordion-item">
                  <button
                    type="button"
                    onClick={() => setActiveAccordion(isAccordionOpen ? null : key)}
                    className="mobile-accordion-btn"
                  >
                    {menus[key].label}
                    <span style={{ fontSize: "1rem" }}>{isAccordionOpen ? "−" : "+"}</span>
                  </button>

                  {isAccordionOpen && (
                    <div style={{ paddingTop: "0.75rem", paddingLeft: "0.5rem" }}>
                      {menus[key].columns.map((column, cIdx) => (
                        <div key={cIdx} style={{ marginBottom: "1rem" }}>
                          {column.heading && (
                            <span className="column-eyebrow" style={{ marginBottom: "0.5rem" }}>
                              {column.heading}
                            </span>
                          )}
                          <div>
                            {column.links.map((link) => (
                              <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="mega-link-item"
                                style={{ fontSize: "1.125rem", marginBottom: "0.5rem" }}
                              >
                                {link.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", paddingTop: "1rem" }}>
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="btn-contact"
              style={{ textAlign: "center", border: "1px solid #e2e8f0" }}
            >
              Contact Us
            </Link>
            <Link
              href="/apply"
              onClick={() => setMobileOpen(false)}
              className="btn-apply"
              style={{ textAlign: "center" }}
            >
              Apply for Incubation
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}