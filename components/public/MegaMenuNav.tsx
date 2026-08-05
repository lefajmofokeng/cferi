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
          { href: "/business-incubation-programme", label: "Business Incubation Programme", desc: "Scale early-stage ventures with direct support" },
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

  // Hover delays prevent accidental closure when moving mouse across gaps
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
        <nav className="hidden lg:flex items-center gap-1">
          {(Object.keys(menus) as MenuKey[]).map((key) => {
            const isOpen = openMenu === key;
            return (
              <div key={key} className="relative" onMouseEnter={() => handleMouseEnter(key)}>
                <button
                  type="button"
                  onClick={() => setOpenMenu(isOpen ? null : key)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isOpen
                      ? "text-white bg-slate-800/80"
                      : "text-slate-300 hover:text-white hover:bg-slate-900/60"
                  }`}
                  aria-expanded={isOpen}
                >
                  {menus[key].label}
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 text-slate-400 ${
                      isOpen ? "rotate-180 text-blue-400" : ""
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
            className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/50 transition-all"
          >
            Contact Us
          </Link>
          <Link
            href="/apply"
            className="text-sm font-semibold text-white px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20 hover:shadow-blue-500/30 transition-all hover:-translate-y-0.5"
          >
            Apply for Incubation
          </Link>
        </div>

        {/* MOBILE TOGGLE BUTTON */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 focus:outline-none"
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

      {/* DESKTOP MEGA MENU DROPDOWN PANEL */}
      {openMenu && (
        <div
          onMouseEnter={() => handleMouseEnter(openMenu)}
          onMouseLeave={handleMouseLeave}
          className="hidden lg:block absolute left-0 right-0 top-full mt-2 w-full bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="mx-auto max-w-6xl p-8 grid grid-cols-12 gap-8">
            {/* Columns Section */}
            <div
              className={`${
                openMenu === "resources" && learnArticles.length > 0
                  ? "col-span-7 grid grid-cols-2 gap-8"
                  : "col-span-12 grid grid-cols-3 gap-8"
              }`}
            >
              {menus[openMenu].columns.map((column, i) => (
                <div key={i} className="space-y-4">
                  {column.heading && (
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-400/90">
                      {column.heading}
                    </p>
                  )}
                  <ul className="space-y-1">
                    {column.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={() => setOpenMenu(null)}
                          className="group block p-2.5 rounded-xl hover:bg-slate-800/70 transition-colors"
                        >
                          <div className="text-sm font-medium text-slate-100 group-hover:text-blue-400 transition-colors">
                            {link.label}
                          </div>
                          {"desc" in link && (
                            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{link.desc}</p>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Featured Section for Resources */}
            {openMenu === "resources" && learnArticles.length > 0 && (
              <div className="col-span-5 border-l border-slate-800/80 pl-8 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-400/90">
                    Latest from Learn
                  </p>
                  <Link
                    href="/learn"
                    onClick={() => setOpenMenu(null)}
                    className="text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    View all &rarr;
                  </Link>
                </div>

                <div className="space-y-3">
                  {learnArticles.map((article) => (
                    <Link
                      key={article.id}
                      href={`/learn/${article.slug}`}
                      onClick={() => setOpenMenu(null)}
                      className="flex items-center gap-3.5 p-2 rounded-xl hover:bg-slate-800/70 group transition-all"
                    >
                      {article.cover_image_url ? (
                        <img
                          src={article.cover_image_url}
                          alt={article.title}
                          className="w-12 h-12 rounded-lg object-cover bg-slate-800 shrink-0 border border-slate-800"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700/60 flex items-center justify-center text-xs text-slate-500 shrink-0">
                          Article
                        </div>
                      )}
                      <span className="text-sm font-medium text-slate-200 group-hover:text-blue-400 line-clamp-2 transition-colors">
                        {article.title}
                      </span>
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
        <div className="lg:hidden fixed inset-x-0 top-[73px] bottom-0 bg-slate-950/95 backdrop-blur-2xl z-50 overflow-y-auto border-t border-slate-800/80 p-6 flex flex-col justify-between animate-in fade-in duration-200">
          <div className="space-y-4">
            {(Object.keys(menus) as MenuKey[]).map((key) => {
              const isAccordionOpen = activeAccordion === key;
              return (
                <div key={key} className="border-b border-slate-800/60 pb-3">
                  <button
                    type="button"
                    onClick={() => setActiveAccordion(isAccordionOpen ? null : key)}
                    className="w-full flex items-center justify-between py-2 text-base font-medium text-slate-100"
                  >
                    {menus[key].label}
                    <svg
                      className={`w-5 h-5 text-slate-400 transition-transform ${
                        isAccordionOpen ? "rotate-180 text-blue-400" : ""
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
                        <div key={cIdx} className="space-y-2">
                          {column.heading && (
                            <p className="text-xs font-semibold uppercase text-blue-400/80">{column.heading}</p>
                          )}
                          <div className="space-y-1">
                            {column.links.map((link) => (
                              <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="block py-1.5 text-sm text-slate-300 hover:text-white"
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
              className="block w-full text-center py-3 rounded-xl border border-slate-800 bg-slate-900 text-slate-200 font-medium text-sm"
            >
              Contact Us
            </Link>
            <Link
              href="/apply"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm shadow-lg shadow-blue-600/30"
            >
              Apply for Incubation
            </Link>
          </div>
        </div>
      )}
    </>
  );
}