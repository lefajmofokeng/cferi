"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type LearnArticle = {
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
        heading: "Incubation & Training",
        links: [
          { href: "/business-incubation-programme", label: "Business Incubation Programme", desc: "Lean startup methodologies, business management development, pitching practices, and masterclasses." },
          { href: "/entrepreneurship-training", label: "Entrepreneurship Training", desc: "Practical frameworks for modern founders" },
          { href: "/mentorship-programme", label: "Mentorship Programme", desc: "1-on-1 guidance from active industry experts" },
          { href: "/enterprise-skills-development", label: "Enterprise & Skills Development", desc: "Targeted skill building for growing teams" },
        ],
      },
    ],
  },
  discover: {
    label: "Discover",
    columns: [
      {
        heading: "About",
        links: [
          { href: "/about", label: "About Us", desc: "Our mission, vision, and operational model" },
          { href: "/corporate-office", label: "Corporate Office", desc: "Headquarters location and facilities" },
          { href: "/leadership", label: "Leadership", desc: "Meet the team leading our platform" },
        ],
      },
      {
        heading: "Careers & Events",
        links: [
          { href: "/jobs", label: "Job Opportunities", desc: "Join our expanding team and network" },
          { href: "/events", label: "Events Calendar", desc: "Workshops, keynotes, and founder meetups" },
        ],
      },
    ],
  },
  resources: {
    label: "Resources",
    columns: [
      {
        heading: "Knowledge & Support",
        links: [
          { href: "/news", label: "News", desc: "Latest ecosystem updates" },
          { href: "/announcements", label: "Announcements", desc: "Official press and platform notices" },
          { href: "/learn", label: "Learn", desc: "In-depth guides and technical articles" },
          { href: "/help-center", label: "Help Center", desc: "FAQs and platform support" },
          { href: "/contact", label: "Contact Us", desc: "Get in touch with our operations team" },
        ],
      },
    ],
  },
  marketFunding: {
    label: "Market & Funding",
    columns: [
      {
        heading: "Opportunities",
        links: [
          { href: "/national-grant-structure", label: "National Grant Structure", desc: "Overview of national funding frameworks" },
          { href: "/corporate-procurement-connections", label: "Corporate Procurement Connections", desc: "Direct access to enterprise supply chains" },
          { href: "/tenders-public-sector-panels", label: "Tenders & Public Sector Panels", desc: "Public sector bidding and active panels" },
        ],
      },
    ],
  },
};

type MenuKey = keyof typeof menus;

export default function MegaMenuNav({ learnArticles }: { learnArticles: LearnArticle[] }) {
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<MenuKey | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close menus on Esc keypress
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
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenMenu(key);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenMenu(null);
    }, 150);
  };

  return (
    <>
      {/* DESKTOP NAVBAR */}
      <div className="flex items-center gap-8" onMouseLeave={handleMouseLeave}>
        <nav className="hidden lg:flex items-center gap-2">
          {(Object.keys(menus) as MenuKey[]).map((key) => {
            const isOpen = openMenu === key;
            return (
              <div key={key} className="relative" onMouseEnter={() => handleMouseEnter(key)}>
                <button
                  type="button"
                  onClick={() => setOpenMenu(isOpen ? null : key)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                    isOpen
                      ? "text-blue-600 bg-slate-100/80"
                      : "text-slate-700 hover:text-blue-600 hover:bg-slate-50"
                  }`}
                  aria-expanded={isOpen}
                >
                  {menus[key].label}
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-blue-600" : "text-slate-400"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            );
          })}
        </nav>

        {/* CTA BUTTONS (DESKTOP) */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/contact"
            className="text-sm font-semibold text-slate-700 hover:text-blue-600 px-4 py-2 transition-colors"
          >
            Contact Us
          </Link>
          <Link
            href="/apply"
            className="text-sm font-semibold text-white px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
          >
            Apply for Incubation
          </Link>
        </div>

        {/* MOBILE TOGGLE BUTTON */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* FULL-WIDTH MEGA MENU DROPDOWN PANEL */}
      {openMenu && (
        <div
          onMouseEnter={() => handleMouseEnter(openMenu)}
          onMouseLeave={handleMouseLeave}
          className="hidden lg:block fixed left-0 right-0 top-[65px] w-full bg-white border-b border-slate-200/80 shadow-2xl z-50 animate-in fade-in duration-150"
        >
          <div className="mx-auto max-w-[1200px] px-6 grid grid-cols-12">
            {/* Left Column Section */}
            <div
              className={`py-8 pr-8 border-r border-slate-100 ${
                openMenu === "resources" && learnArticles.length > 0
                  ? "col-span-5 space-y-6"
                  : "col-span-12 grid grid-cols-3 gap-8"
              }`}
            >
              {menus[openMenu].columns.map((column, i) => (
                <div key={i} className="space-y-6">
                  {column.heading && (
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {column.heading}
                    </p>
                  )}
                  <ul className="space-y-5">
                    {column.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={() => setOpenMenu(null)}
                          className="group flex items-start gap-4 transition-colors"
                        >
                          {/* Square Thumbnail Image / Placeholder */}
                          <div className="w-14 h-14 rounded-lg bg-slate-900 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                            <span className="text-xs font-bold text-white uppercase tracking-wider">
                              {link.label.slice(0, 2)}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <div className="text-base font-bold text-slate-900 group-hover:text-emerald-500 transition-colors">
                              {link.label}
                            </div>
                            {"desc" in link && (
                              <p className="text-xs text-slate-500 leading-relaxed group-hover:text-emerald-600 transition-colors line-clamp-2">
                                {link.desc}
                              </p>
                            )}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Right Featured Section (Full-bleed images) */}
            {openMenu === "resources" && learnArticles.length > 0 && (
              <div className="col-span-7 py-8 pl-8 space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Featured Articles
                  </p>
                  <Link
                    href="/learn"
                    onClick={() => setOpenMenu(null)}
                    className="text-xs font-bold text-slate-900 hover:text-blue-600 tracking-wider uppercase transition-colors"
                  >
                    View All &rarr;
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {learnArticles.map((article) => (
                    <Link
                      key={article.id}
                      href={`/learn/${article.slug}`}
                      onClick={() => setOpenMenu(null)}
                      className="group flex flex-col justify-between space-y-4"
                    >
                      {/* Full-bleed cover image (no padding/margin) */}
                      <div className="aspect-[16/9] w-full rounded-lg bg-slate-100 overflow-hidden border border-slate-200/80">
                        {article.cover_image_url ? (
                          <img
                            src={article.cover_image_url}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                              Maluti Center
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 flex-grow">
                        <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          Explore our latest article on incubation strategy and modern development.
                        </p>
                      </div>

                      <div className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1 group-hover:text-blue-600 transition-colors pt-2">
                        <span>Read More</span>
                        <span>&gt;</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] bottom-0 bg-white z-50 overflow-y-auto border-t border-slate-200 p-6 flex flex-col justify-between">
          <div className="space-y-4">
            {(Object.keys(menus) as MenuKey[]).map((key) => {
              const isAccordionOpen = activeAccordion === key;
              return (
                <div key={key} className="border-b border-slate-100 pb-3">
                  <button
                    type="button"
                    onClick={() => setActiveAccordion(isAccordionOpen ? null : key)}
                    className="w-full flex items-center justify-between py-2 text-base font-bold text-slate-900"
                  >
                    {menus[key].label}
                    <svg
                      className={`w-5 h-5 text-slate-400 transition-transform ${
                        isAccordionOpen ? "rotate-180 text-blue-600" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isAccordionOpen && (
                    <div className="pt-2 pl-2 space-y-4">
                      {menus[key].columns.map((column, cIdx) => (
                        <div key={cIdx} className="space-y-3">
                          {column.heading && (
                            <p className="text-xs font-bold uppercase text-slate-400">{column.heading}</p>
                          )}
                          <div className="space-y-2">
                            {column.links.map((link) => (
                              <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="block py-1.5 text-sm font-semibold text-slate-700 hover:text-blue-600"
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

          {/* MOBILE FOOTER ACTIONS */}
          <div className="pt-8 space-y-3">
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-bold text-sm"
            >
              Contact Us
            </Link>
            <Link
              href="/apply"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center py-3 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md"
            >
              Apply for Incubation
            </Link>
          </div>
        </div>
      )}
    </>
  );
}