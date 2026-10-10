"use client";

import { useState } from "react";
import Link from "next/link";

const columns = [
  {
    heading: "Programs",
    links: [
      { href: "/business-incubation-programme", label: "Business Incubation Programme" },
      { href: "/entrepreneurship-training", label: "Entrepreneurship Training" },
      { href: "/mentorship-programme", label: "Mentorship Programme" },
      { href: "/admin-compliance-support", label: "Admin & Compliance Support" },
    ],
  },
  {
    heading: "Discover",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/roadmap", label: "Roadmap" },
      { href: "/council-management", label: "Council & Management" },
      { href: "/corporate-office", label: "Office" },
      { href: "/awards-achievements", label: "Awards & Achievements" },
      { href: "/community-projects", label: "Community Projects" },
      { href: "/work-integrated-learning-partners", label: "Work-Integrated Learning Partners" },
      { href: "/jobs", label: "Job Opportunities" },
      { href: "/governance", label: "Governance" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { href: "/contact", label: "Contact Us" },
      { href: "/learn", label: "Learn" },
      { href: "/case-studies", label: "Case Studies" },
      { href: "/research-papers", label: "Research Papers" },
      { href: "/faqs", label: "FAQs" },
      { href: "/glossary", label: "Glossary" },
      { href: "/application-guide", label: "Application Guide" },
    ],
  },
  {
    heading: "Market & Funding",
    links: [
      { href: "/national-grant-structure", label: "National Grant Structure" },
      { href: "/corporate-procurement-connections", label: "Corporate Procurement Connections" },
      { href: "/tenders-public-sector-panels", label: "Tenders & Public Sector Panels" },
      { href: "/exhibitions-commercial-trades", label: "Exhibitions & Commercial Trades" },
    ],
  },
  {
    heading: "Keeping Up With Us",
    links: [
      { href: "/news", label: "News" },
      { href: "/events", label: "Events" },
      { href: "/announcements", label: "Announcements" },
      { href: "https://facebook.com/malutiincubation", label: "On Facebook" },
      { href: "/gallery", label: "Gallery" },
    ],
  },
];

export default function Footer() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleAccordion = (heading: string) => {
    setOpenSection(openSection === heading ? null : heading);
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Top Brand / Newsletter Intro Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-12 border-b border-slate-800 items-start">
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-xl font-medium tracking-tight text-white">
              Center for Entrepreneurship & Rapid Incubation
            </h3>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Empowering student innovators and local entrepreneurs with world-class mentorship, rapid digital prototyping, and enterprise funding pathways.
            </p>
          </div>
          <div className="lg:col-span-7 flex flex-col sm:flex-row gap-3 justify-end items-start lg:items-center">
            <div className="w-full sm:w-auto flex-1 max-w-md">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Stay connected with our initiatives
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-4 py-2.5 flex-1 focus:outline-none focus:border-slate-500 placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  className="bg-white text-slate-900 font-medium text-sm px-5 py-2.5 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Navigation Link Columns / Mobile Accordions */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 py-12 border-b border-slate-800">
          {columns.map((column) => {
            const isOpen = openSection === column.heading;
            return (
              <div key={column.heading} className="border-b border-slate-800 md:border-none pb-4 md:pb-0">
                {/* Desktop Header */}
                <h4 className="hidden md:block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-4">
                  {column.heading}
                </h4>

                {/* Mobile Accordion Trigger */}
                <button
                  onClick={() => toggleAccordion(column.heading)}
                  className="md:hidden w-full flex items-center justify-between py-2 text-left text-white font-medium focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm uppercase tracking-wider text-slate-300 font-semibold">
                    {column.heading}
                  </span>
                  <svg
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      isOpen ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Link Items (Always visible on Desktop, collapsible on Mobile) */}
                <ul
                  className={`space-y-2.5 mt-3 md:mt-0 ${
                    isOpen ? "block" : "hidden md:block"
                  }`}
                >
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-slate-400 hover:text-white transition-colors block py-0.5"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Maluti TVET College, Center for Entrepreneurship & Rapid Incubation[cite: 4]. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/privacy-policy" className="hover:text-slate-300 transition-colors">
              Privacy Policy[cite: 4]
            </Link>
            <Link href="/terms-of-service" className="hover:text-slate-300 transition-colors">
              Terms of Service[cite: 4]
            </Link>
            <Link href="/cookie-policy" className="hover:text-slate-300 transition-colors">
              Cookie Policy[cite: 4]
            </Link>
            <Link href="/help-center" className="hover:text-slate-300 transition-colors">
              Help Center[cite: 4]
            </Link>
            <Link href="/press-enquiries" className="hover:text-slate-300 transition-colors">
              Press Enquiries[cite: 4]
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}