import Link from "next/link";
import "./EcosystemStackSection.css";

interface ProgramModule {
  badge: string;
  title: string;
  description: string;
  actionText: string;
  actionHref: string;
  theme: "dark" | "blue" | "light" | "green";
  visualUrl: string;
}

const programs: ProgramModule[] = [
  {
    badge: "Module 01",
    title: "Business Incubation & Acceleration",
    description:
      "A tailored 12-month incubation framework providing early-stage enterprise support, operational spaces, direct mentorship, and formal regulatory compliance assistance for tech-enabled startups.",
    actionText: "Apply for Incubation →",
    actionHref: "/apply",
    theme: "dark",
    visualUrl:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
  },
  {
    badge: "Module 02",
    title: "Smart Agro-Tech & Sustainable Labs",
    description:
      "Integrating IoT sensors, automated hydroponic vertical setups, and climate-controlled testing facilities to transition regional agriculture into high-yield, data-driven commercial enterprises.",
    actionText: "Explore Agri Labs →",
    actionHref: "/programs/agri-tech",
    theme: "blue",
    visualUrl:
      "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80",
  },
  {
    badge: "Module 03",
    title: "Rapid Prototyping & Digital Fabrication",
    description:
      "Equipping local entrepreneurs with high-precision manufacturing tools—including CNC machinery, laser cutters, 3D printing stations, and hardware prototyping infrastructure.",
    actionText: "View Fabrication Specs →",
    actionHref: "/programs/fabrication",
    theme: "light",
    visualUrl:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
  },
  {
    badge: "Module 04",
    title: "Commercial Procurement & Market Access",
    description:
      "Connecting incubated ventures directly with public sector panels, enterprise trade networks, and corporate procurement channels to secure sustainable commercial supply contracts.",
    actionText: "Access Market Portal →",
    actionHref: "/programs/market-access",
    theme: "green",
    visualUrl:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
  },
];

export default function EcosystemStackSection({
  id = "ecosystem-stack",
}: {
  id?: string;
}) {
  return (
    <section id={id} className="ecosystem-stack">
      <div className="ecosystem-stack__container">
        <div className="ecosystem-stack__header">
          <h2 className="ecosystem-stack__heading">Incubation programs</h2>
        </div>

        <div className="ecosystem-stack__cards">
          {programs.map((prog) => (
            <div key={prog.badge} className="ecosystem-card-wrapper">
              <div className={`ecosystem-card ecosystem-card--${prog.theme}`}>
                <div className="ecosystem-card__info">
                  <span className="ecosystem-card__badge">{prog.badge}</span>
                  <h3 className="ecosystem-card__title">{prog.title}</h3>
                  <p className="ecosystem-card__description">
                    {prog.description}
                  </p>
                  <Link href={prog.actionHref} className="ecosystem-card__action">
                    {prog.actionText}
                  </Link>
                </div>

                <div className="ecosystem-card__visual">
                  <img
                    src={prog.visualUrl}
                    alt={prog.title}
                    className="ecosystem-card__image"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}