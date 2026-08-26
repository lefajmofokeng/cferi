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
  return (
    <footer className="border-t border-gray-200 mt-16">
      <div className="mx-auto max-w-6xl px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {columns.map((column) => (
          <div key={column.heading}>
            <p className="text-xs uppercase text-gray-400 mb-3">{column.heading}</p>
            <ul className="space-y-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-600 hover:text-gray-900">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100">
        <div className="mx-auto max-w-6xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Maluti TVET College, Center for Entrepreneurship & Rapid Incubation. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-gray-900">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-gray-900">
              Terms of Service
            </Link>
            <Link href="/cookie-policy" className="hover:text-gray-900">
              Cookie Policy
            </Link>
            <Link href="/help-center" className="hover:text-gray-900">
              Help Center
            </Link>
            <Link href="/cookie-policy" className="hover:text-gray-900">
              Press Enquiries
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}