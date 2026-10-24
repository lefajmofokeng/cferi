"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

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
          {
            href: "/business-incubation-programme",
            label: "Business Incubation",
            desc: "Lean startup methodologies, business management development, pitching practices, and masterclasses.",
            icon: (
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            ),
          },
          {
            href: "/entrepreneurship-training",
            label: "Entrepreneurship Training",
            desc: "Intensive operational training modules focused on local scalable frameworks for emerging SMMEs.",
            icon: (
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            ),
          },
        ],
      },
      {
        heading: "Scaling",
        links: [
          {
            href: "/mentorship-programme",
            label: "Mentorship Program",
            desc: "Direct deployment of expert corporate mentors to work directly on your unique scaling blockages.",
            icon: (
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            ),
          },
          {
            href: "/admin-compliance-support",
            label: "Admin & Compliance",
            desc: "Fast-tracked business registrations through CIPC, SARS tax compliance, and robust financial framework setups.",
            icon: (
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            ),
          },
        ],
      },
      {
        heading: "Support",
        links: [
          {
            href: "/help-center",
            label: "Help Center",
            desc: "FAQs and platform support.",
            icon: (
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ),
          },
          {
            href: "/contact",
            label: "Contact Operations",
            desc: "Get in touch with our operations team.",
            icon: (
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            ),
          },
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
          {
            href: "/about",
            label: "About Us",
            desc: "Learn about our mission statement, vision and team.",
            icon: (
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h5m0 0v-5a2 2 0 012-2h2a2 2 0 012 2v5m-14 0V9a2 2 0 012-2h2a2 2 0 012 2v12" />
              </svg>
            ),
          },
          {
            href: "/corporate-office",
            label: "Corporate Office",
            desc: "Headquarters location and facilities.",
            icon: (
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            ),
          },
          {
            href: "/leadership",
            label: "Leadership",
            desc: "Meet the team leading our platform.",
            icon: (
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            ),
          },
        ],
      },
      {
        heading: "Ecosystem",
        links: [
          {
            href: "/jobs",
            label: "Job Opportunities",
            desc: "Join our expanding team and network.",
            icon: (
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            ),
          },
          {
            href: "/events",
            label: "Events Calendar",
            desc: "Workshops, keynotes, and founder meetups.",
            icon: (
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            ),
          },
        ],
      },
    ],
  },
  resources: {
    label: "Resources",
    columns: [
      {
        heading: "Updates",
        links: [
          {
            href: "/news",
            label: "News & Insights",
            desc: "Latest ecosystem updates and press.",
            icon: (
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            ),
          },
        ],
      },
      {
        heading: "Notices",
        links: [
          {
            href: "/announcements",
            label: "Announcements",
            desc: "Official press and platform notices.",
            icon: (
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A2.5 2.5 0 013 11.2V8.8a2.5 2.5 0 012.436-2.483l5.564-.317v8.003l-5.564-.32z" />
              </svg>
            ),
          },
        ],
      },
      {
        heading: "Guides",
        links: [
          {
            href: "/learn",
            label: "Learn & Guides",
            desc: "In-depth guides and technical articles.",
            icon: (
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            ),
          },
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
          {
            href: "/national-grant-structure",
            label: "National Grants",
            desc: "Access non-repayable grant capital through SEDA and NYDA pipelines.",
            icon: (
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
          },
          {
            href: "/corporate-procurement-connections",
            label: "Corporate Procurement",
            desc: "B-BBEE supplier development programs and private manufacturing lines.",
            icon: (
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            ),
          },
        ],
      },
      {
        heading: "Tenders & Trade",
        links: [
          {
            href: "/tenders-public-sector-panels",
            label: "Public Sector Panels",
            desc: "Frameworks covering compliance and bidding accuracy.",
            icon: (
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            ),
          },
          {
            href: "/exhibitions-commercial-trades",
            label: "Commercial Trade Shows",
            desc: "Commercial trade exhibitions and enterprise market expansion.",
            icon: (
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5a2.5 2.5 0 002.5-2.5V11.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 5H12a2 2 0 00-2-2h-1.065z" />
              </svg>
            ),
          },
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
  const [liveResults, setLiveResults] = useState<
    { href: string; title: string; desc: string; category: string; cover_image_url: string | null }[]
  >([]);

  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (trimmed.length < 2) {
      setLiveResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      const supabase = createClient();
      const pattern = `%${trimmed}%`;

      const [news, jobs, events, research] = await Promise.all([
        supabase
          .from("news_posts")
          .select("title, slug")
          .eq("status", "published")
          .ilike("title", pattern)
          .limit(5),
        supabase
          .from("job_posts")
          .select("title, slug")
          .eq("status", "published")
          .ilike("title", pattern)
          .limit(5),
        supabase
          .from("events")
          .select("title, slug")
          .eq("status", "published")
          .ilike("title", pattern)
          .limit(5),
        supabase
          .from("research_papers")
          .select("title, slug")
          .eq("status", "published")
          .ilike("title", pattern)
          .limit(5),
      ]);

      setLiveResults([
        ...(news.data ?? []).map((n) => ({
          href: `/news/${n.slug}`,
          title: n.title,
          desc: "News",
          category: "News",
          cover_image_url: null,
        })),
        ...(jobs.data ?? []).map((j) => ({
          href: `/jobs/${j.slug}`,
          title: j.title,
          desc: "Job Opportunity",
          category: "Jobs",
          cover_image_url: null,
        })),
        ...(events.data ?? []).map((e) => ({
          href: `/events/${e.slug}`,
          title: e.title,
          desc: "Event",
          category: "Events",
          cover_image_url: null,
        })),
        ...(research.data ?? []).map((r) => ({
          href: `/research-papers/${r.slug}`,
          title: r.title,
          desc: "Research Paper",
          category: "Research",
          cover_image_url: null,
        })),
      ]);
    }, 250);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

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

  const staticFilteredResults = searchQuery.trim()
    ? allSearchableItems.filter(
        (i) =>
          i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.desc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const searchResults = [...staticFilteredResults, ...liveResults];

  const featuredArticle = learnArticles.length > 0 ? learnArticles[0] : null;
  const featuredCaseStudy = caseStudies.length > 0 ? caseStudies[0] : null;

  return (
    <div className="nav-wrapper" onMouseLeave={handleMouseLeave}>
      {openMenu && <div className="menu-backdrop" onClick={() => setOpenMenu(null)} />}

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

      {openMenu && (
        <div
          onMouseEnter={() => openMenu !== "search" && handleMouseEnter(openMenu as MenuKey)}
          onMouseLeave={handleMouseLeave}
          className="megamenu-drawer"
        >
          <div className="megamenu-inner">
            {openMenu === "search" ? (
              <div className="search-megamenu-container">
                <div className="search-input-wrapper">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Maluti"
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
              <div className="megamenu-grid">
                {/* Single Overlay Image Card Aligned Left */}
                {openMenu === "resources" && featuredArticle && (
                  <div className="grid-col-featured-left">
                    <div className="editorial-card-left">
                      <Link
                        href={`/learn/${featuredArticle.slug}`}
                        onClick={() => setOpenMenu(null)}
                        className="editorial-card-image"
                      >
                        {featuredArticle.cover_image_url ? (
                          <img src={featuredArticle.cover_image_url} alt={featuredArticle.title} />
                        ) : (
                          <div className="editorial-placeholder">Learn Article</div>
                        )}
                        <div className="editorial-card-overlay">
                          <span className="editorial-card-eyebrow">Learn & Guides</span>
                          <h3 className="editorial-card-title">{featuredArticle.title}</h3>
                        </div>
                      </Link>

                      <Link
                        href="/learn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenu(null);
                        }}
                        className="editorial-view-all"
                      >
                        <span>Show all articles</span>
                        <span className="arrow-icon">↗</span>
                      </Link>
                    </div>
                  </div>
                )}

                {openMenu === "programs" && featuredCaseStudy && (
                  <div className="grid-col-featured-left">
                    <div className="editorial-card-left">
                      <Link
                        href={`/case-studies/${featuredCaseStudy.slug}`}
                        onClick={() => setOpenMenu(null)}
                        className="editorial-card-image"
                      >
                        {featuredCaseStudy.cover_image_url ? (
                          <img src={featuredCaseStudy.cover_image_url} alt={featuredCaseStudy.title} />
                        ) : (
                          <div className="editorial-placeholder">Case Study</div>
                        )}
                        <div className="editorial-card-overlay">
                          <span className="editorial-card-eyebrow">Case Studies</span>
                          <h3 className="editorial-card-title">{featuredCaseStudy.title}</h3>
                        </div>
                      </Link>

                      <Link
                        href="/case-studies"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenu(null);
                        }}
                        className="editorial-view-all"
                      >
                        <span>Show all case studies</span>
                        <span className="arrow-icon">↗</span>
                      </Link>
                    </div>
                  </div>
                )}

                {/* 3 Link Columns Positioned Right */}
                <div
                  className={
                    (openMenu === "resources" && featuredArticle) ||
                    (openMenu === "programs" && featuredCaseStudy)
                      ? "grid-col-three"
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
                              style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}
                            >
                              <div style={{ flexShrink: 0, marginTop: "0.125rem" }}>{link.icon}</div>
                              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                                <span style={{ fontWeight: 600, lineHeight: "1.2" }}>{link.label}</span>
                                {link.desc && (
                                  <span style={{ fontSize: "0.8125rem", color: "#64748b", fontWeight: 400, lineHeight: "1.35" }}>
                                    {link.desc}
                                  </span>
                                )}
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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
                      {key === "resources" && featuredArticle && (
                        <div className="mobile-editorial-card" style={{ marginBottom: "1.25rem", borderRadius: "12px", overflow: "hidden", border: "1px solid #e2e8f0", backgroundColor: "#0f172a" }}>
                          <Link
                            href={`/learn/${featuredArticle.slug}`}
                            onClick={() => setMobileOpen(false)}
                            style={{ display: "block", height: "180px", position: "relative" }}
                          >
                            {featuredArticle.cover_image_url ? (
                              <img src={featuredArticle.cover_image_url} alt={featuredArticle.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                              <div className="editorial-placeholder" style={{ height: "100%" }}>Learn Article</div>
                            )}
                            <div className="editorial-card-overlay" style={{ padding: "1rem" }}>
                              <span className="editorial-card-eyebrow">Learn & Guides</span>
                              <h3 className="editorial-card-title" style={{ fontSize: "1rem" }}>{featuredArticle.title}</h3>
                            </div>
                          </Link>

                          <Link
                            href="/learn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setMobileOpen(false);
                            }}
                            className="editorial-view-all-mobile"
                          >
                            <span>Show all articles</span>
                            <span className="arrow-icon">↗</span>
                          </Link>
                        </div>
                      )}

                      {key === "programs" && featuredCaseStudy && (
                        <div className="mobile-editorial-card" style={{ marginBottom: "1.25rem", borderRadius: "12px", overflow: "hidden", border: "1px solid #e2e8f0", backgroundColor: "#0f172a" }}>
                          <Link
                            href={`/case-studies/${featuredCaseStudy.slug}`}
                            onClick={() => setMobileOpen(false)}
                            style={{ display: "block", height: "180px", position: "relative" }}
                          >
                            {featuredCaseStudy.cover_image_url ? (
                              <img src={featuredCaseStudy.cover_image_url} alt={featuredCaseStudy.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                              <div className="editorial-placeholder" style={{ height: "100%" }}>Case Study</div>
                            )}
                            <div className="editorial-card-overlay" style={{ padding: "1rem" }}>
                              <span className="editorial-card-eyebrow">Case Studies</span>
                              <h3 className="editorial-card-title" style={{ fontSize: "1rem" }}>{featuredCaseStudy.title}</h3>
                            </div>
                          </Link>

                          <Link
                            href="/case-studies"
                            onClick={(e) => {
                              e.stopPropagation();
                              setMobileOpen(false);
                            }}
                            className="editorial-view-all-mobile"
                          >
                            <span>Show all case studies</span>
                            <span className="arrow-icon">↗</span>
                          </Link>
                        </div>
                      )}

                      {menus[key].columns.map((column, cIdx) => (
                        <div key={cIdx} style={{ marginBottom: "1rem" }}>
                          {column.heading && (
                            <span className="column-eyebrow" style={{ marginBottom: "0.5rem" }}>
                              {column.heading}
                            </span>
                          )}
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            {column.links.map((link) => (
                              <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="mega-link-item"
                                style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", fontSize: "1rem", marginBottom: "0.25rem" }}
                              >
                                <div style={{ flexShrink: 0, marginTop: "0.125rem" }}>{link.icon}</div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                                  <span style={{ fontWeight: 600, lineHeight: "1.2" }}>{link.label}</span>
                                  {link.desc && (
                                    <span style={{ fontSize: "0.8125rem", color: "#64748b", fontWeight: 400, lineHeight: "1.35" }}>
                                      {link.desc}
                                    </span>
                                  )}
                                </div>
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