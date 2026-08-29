"use client";

import Link from "next/link";

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

export default function EcosystemStackSection() {
  return (
    <section id="ecosystem-stack" className="relative w-full py-35 bg-white">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        
        {/* --- HEADER LAYER --- */}
        <div className="text-left mb-12">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-gray-900">
            Incubation programs
          </h2>
        </div>

        {/* --- STACKING CARDS CONTAINER --- */}
        <div className="relative flex flex-col w-full pb-20">
          {programs.map((prog) => {
            const isDark = prog.theme === "dark";
            const isBlue = prog.theme === "blue";
            const isLight = prog.theme === "light";
            const isGreen = prog.theme === "green";

            return (
              <div
                key={prog.badge}
                className="sticky top-30 w-full mb-12 transform-gpu"
              >
                <div
                  className={`w-full min-h-[520px] rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 ${
                    isDark
                      ? "bg-[#0f1115] text-white"
                      : isBlue
                      ? "bg-blue-600 text-white"
                      : isGreen
                      ? "bg-emerald-900 text-white"
                      : "bg-slate-50 text-gray-900 border border-slate-200"
                  }`}
                >
                  {/* Left Info Column */}
                  <div className="lg:col-span-7 p-8 sm:p-12 md:p-16 flex flex-col justify-center items-start">
                    <span
                      className={`text-[11px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-6 ${
                        isDark
                          ? "bg-white/10 text-white/80"
                          : isBlue || isGreen
                          ? "bg-white/20 text-white"
                          : "bg-slate-200 text-slate-800"
                      }`}
                    >
                      {prog.badge}
                    </span>

                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight mb-4 leading-tight">
                      {prog.title}
                    </h3>

                    <p
                      className={`text-sm sm:text-base md:text-lg leading-relaxed mb-8 ${
                        isDark
                          ? "text-slate-400"
                          : isBlue || isGreen
                          ? "text-slate-100"
                          : "text-slate-600"
                      }`}
                    >
                      {prog.description}
                    </p>

                    <Link
                      href={prog.actionHref}
                      className={`inline-flex items-center px-7 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                        isDark
                          ? "bg-white text-gray-900 hover:bg-blue-600 hover:text-white"
                          : isBlue || isGreen
                          ? "bg-white text-gray-900 hover:bg-black hover:text-white"
                          : "bg-gray-900 text-white hover:bg-blue-600"
                      }`}
                    >
                      {prog.actionText}
                    </Link>
                  </div>

                  {/* Right Image Visual Column */}
                  <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full w-full overflow-hidden">
                    <img
                      src={prog.visualUrl}
                      alt={prog.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}