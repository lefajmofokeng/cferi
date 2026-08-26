"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import SiteSearch from "./SiteSearch";

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
        heading: "Incubation & Training",
        links: [
          { href: "/business-incubation-programme", label: "Business Incubation Programme", desc: "Lean startup methodologies, business management development, pitching practices, and masterclasses." },
          { href: "/entrepreneurship-training", label: "Entrepreneurship Training", desc: "Intensive operational training modules focused on local scalable frameworks for emerging SMMEs." },
          { href: "/mentorship-programme", label: "Mentorship Programme", desc: "Direct deployment of expert corporate mentors to work directly on your unique scaling blockages." },
          { href: "/admin-compliance-support", label: "Admin & Compliance Support", desc: "Seamless fast-tracked business registrations through CIPC, SARS tax compliance, and robust financial framework setups." },
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
          { href: "/about", label: "About Us", desc: "Learn about our mission statement, vision and team" },
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
          { href: "/national-grant-structure", label: "National Grant Structure", desc: "Direct linkage configurations for accessing non-repayable grant capital through SEDA and NYDA pipelines." },
          { href: "/corporate-procurement-connections", label: "Corporate Procurement Connections", desc: "Direct positioning within corporate B-BBEE supplier development programs and private manufacturing lines." },
          { href: "/tenders-public-sector-panels", label: "Tenders & Public Sector Panels", desc: "Intensive training frameworks covering compliance, bidding accuracy, and local government procurement tracks." },
          { href: "/exhibitions-commercial-trades", label: "Exhibitions & Commercial Trades", desc: "Intensive training frameworks covering compliance, bidding accuracy, and local government procurement tracks." },
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
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);
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
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenMenu(key);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenMenu(null);
    }, 150);
  };

  return (
    <div className="flex items-center" onMouseLeave={handleMouseLeave}>
      {/* Desktop Links (No Caret Icons) */}
      <nav className="hidden lg:flex items-center gap-1">
        {(Object.keys(menus) as MenuKey[]).map((key) => {
          const isOpen = openMenu === key;
          return (
            <div key={key} className="relative" onMouseEnter={() => handleMouseEnter(key)}>
              <button
                type="button"
                onClick={() => setOpenMenu(isOpen ? null : key)}
                className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all ${
                  isOpen
                    ? "text-slate-950 bg-slate-100"
                    : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
                }`}
                aria-expanded={isOpen}
              >
                {menus[key].label}
              </button>
            </div>
          );
        })}
      </nav>

      {/* Mobile Actions Toggle */}
      <div className="flex items-center gap-2 lg:hidden">
        <SiteSearch />
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
          aria-label="Toggle menu"
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

      {/* Full-width Mega Menu Drawer */}
      {openMenu && (
        <div
          onMouseEnter={() => handleMouseEnter(openMenu)}
          onMouseLeave={handleMouseLeave}
          className="hidden lg:block absolute left-0 right-0 top-[64px] w-full bg-white border-b border-slate-200/80 shadow-xl z-50 animate-in fade-in duration-150"
        >
          <div className="mx-auto max-w-7xl px-8 grid grid-cols-12">
            <div
              className={`py-8 pr-8 border-r border-slate-100 ${
                (openMenu === "resources" && learnArticles.length > 0) ||
                (openMenu === "programs" && caseStudies.length > 0)
                  ? "col-span-5 space-y-6"
                  : "col-span-12 grid grid-cols-3 gap-8"
              }`}
            >
              {menus[openMenu].columns.map((column, i) => (
                <div key={i} className="space-y-6">
                  {column.heading && (
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      {column.heading}
                    </p>
                  )}
                  <ul className="space-y-4">
                    {column.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={() => setOpenMenu(null)}
                          className="group flex items-start gap-3.5 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                            <span className="text-xs font-bold text-white uppercase tracking-wider">
                              {link.label.slice(0, 2)}
                            </span>
                          </div>
                          <div className="space-y-0.5">
                            <div className="text-sm font-semibold text-slate-900 group-hover:text-sky-600 transition-colors">
                              {link.label}
                            </div>
                            {"desc" in link && (
                              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
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

            {/* Dynamic Featured Content */}
            {openMenu === "resources" && learnArticles.length > 0 && (
              <div className="col-span-7 py-8 pl-8">
                <div className="bg-slate-50 rounded-2xl p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Featured Articles
                    </p>
                    <Link
                      href="/learn"
                      onClick={() => setOpenMenu(null)}
                      className="text-xs font-bold text-slate-900 hover:text-sky-600 tracking-wider uppercase transition-colors"
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
                        className="group flex flex-col justify-between space-y-3"
                      >
                        <div className="aspect-[16/9] w-full rounded-xl bg-slate-100 overflow-hidden border border-slate-200/80">
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
                        <div className="space-y-1 flex-grow">
                          <h3 className="text-sm font-semibold text-slate-900 leading-snug group-hover:text-sky-600 transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                        </div>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1 group-hover:text-sky-600 transition-colors pt-1">
                          <span>Read More</span>
                          <span>&rarr;</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {openMenu === "programs" && caseStudies.length > 0 && (
              <div className="col-span-7 py-8 pl-8">
                <div className="bg-slate-50 rounded-2xl p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Featured Case Studies
                    </p>
                    <Link
                      href="/case-studies"
                      onClick={() => setOpenMenu(null)}
                      className="text-xs font-bold text-slate-900 hover:text-sky-600 tracking-wider uppercase transition-colors"
                    >
                      View All &rarr;
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    {caseStudies.map((cs) => (
                      <Link
                        key={cs.id}
                        href={`/case-studies/${cs.slug}`}
                        onClick={() => setOpenMenu(null)}
                        className="group flex flex-col justify-between space-y-3"
                      >
                        <div className="aspect-[16/9] w-full rounded-xl bg-slate-100 overflow-hidden border border-slate-200/80">
                          {cs.cover_image_url ? (
                            <img
                              src={cs.cover_image_url}
                              alt={cs.title}
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
                        <div className="space-y-1 flex-grow">
                          <h3 className="text-sm font-semibold text-slate-900 leading-snug group-hover:text-sky-600 transition-colors line-clamp-2">
                            {cs.title}
                          </h3>
                        </div>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1 group-hover:text-sky-600 transition-colors pt-1">
                          <span>Read More</span>
                          <span>&rarr;</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[64px] bottom-0 bg-white z-50 overflow-y-auto p-6 flex flex-col justify-between border-t border-slate-100">
          <div className="space-y-4">
            {(Object.keys(menus) as MenuKey[]).map((key) => {
              const isAccordionOpen = activeAccordion === key;
              return (
                <div key={key} className="border-b border-slate-100 pb-3">
                  <button
                    type="button"
                    onClick={() => setActiveAccordion(isAccordionOpen ? null : key)}
                    className="w-full flex items-center justify-between py-2 text-base font-semibold text-slate-900"
                  >
                    {menus[key].label}
                    <svg
                      className={`w-5 h-5 text-slate-400 transition-transform ${
                        isAccordionOpen ? "rotate-180 text-sky-600" : ""
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
                            <p className="text-xs font-semibold uppercase text-slate-400">{column.heading}</p>
                          )}
                          <div className="space-y-2">
                            {column.links.map((link) => (
                              <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="block py-1.5 text-sm font-medium text-slate-600 hover:text-sky-600"
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

          <div className="pt-8 space-y-3">
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center py-3 rounded-full border border-slate-200 bg-slate-50 text-slate-900 font-semibold text-sm"
            >
              Contact Us
            </Link>
            <Link
              href="/apply"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center py-3 rounded-full bg-slate-950 text-white font-semibold text-sm shadow-md"
            >
              Apply for Incubation
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}