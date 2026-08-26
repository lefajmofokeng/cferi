"use client";

import React, { useState } from "react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  items: FAQItem[];
}

const FAQ_SECTIONS: FAQCategory[] = [
  {
    title: "General Information & Purpose",
    items: [
      {
        id: "gen-1",
        question: "What is the primary mission of the Maluti TVET College Incubation Center?",
        answer:
          "The Entrepreneurship Rapid Incubator at Maluti TVET College serves as a strategic business accelerator designed to bridge the gap between vocational training, digital technology, and commercial enterprise. Our primary mission is to foster sustainable job creation across the Thabo Mofutsanyana District by equipping emerging founders with technical infrastructure, formal business mentorship, legal compliance guidance, and direct pathways to local and regional supply chains.",
      },
      {
        id: "gen-2",
        question: "Where is the Incubation Center located, and can I visit in person?",
        answer:
          "Our central administrative hub and main digital co-working facility are situated at the Phuthaditjhaba Campus in Qwaqwa, with satellite advisory desks and drop-in hot-desking stations extending across our corporate campuses including Harrismith and Bethlehem. Operating hours are Monday through Friday, 08:00 to 16:30. Walk-ins are welcome for general inquiries, though structured advisory sessions require a pre-scheduled appointment.",
      },
      {
        id: "gen-3",
        question: "Is the incubator exclusively reserved for software and tech startups?",
        answer:
          "No. While we heavily encourage tech-enabled solutions due to their scalability, the incubator supports ventures across a diverse spectrum of sectors. Our current portfolio includes businesses in agricultural technology, sustainable farming, light industrial manufacturing, eco-friendly beauty and skincare, retail fintech, and vocational trade services.",
      },
    ],
  },
  {
    title: "Eligibility & Cohort Selection",
    items: [
      {
        id: "el-1",
        question: "Who is eligible to apply for admission into the incubator?",
        answer:
          "Eligibility is open to currently registered Maluti TVET College students, recent college alumni, and local community entrepreneurs operating within the Free State province. Applicants must present a viable business concept, early-stage product prototype, or an existing micro-enterprise that demonstrates clear potential for economic sustainability and regional job creation.",
      },
      {
        id: "el-2",
        question: "Do I need to have a fully registered company (CIPC) before applying?",
        answer:
          "No, having a pre-registered company is not a prerequisite for admission. If your concept is selected, our legal and compliance track will walk you step-by-step through formal CIPC registration, SARS income tax registration, COIDA compliance, and acquiring industry-specific operating permits during your initial ideation phase.",
      },
      {
        id: "el-3",
        question: "What criteria does the selection committee use to evaluate applications?",
        answer:
          "Applications undergo a rigorous panel review based on four core criteria: Innovation & Relevance (addressing a distinct market need or regional inefficiency), Feasibility (practical execution capacity and technical background of the team), Commercial Viability (clear revenue strategy and market demand), and Growth Potential (scalability and potential for downstream job creation).",
      },
      {
        id: "el-4",
        question: "Can I apply if I am a solo founder without a co-founding team?",
        answer:
          "Yes. Solo founders are fully eligible to apply. However, because building a successful business requires multi-disciplinary skills, our team will actively work with you during the incubation cycle to pair you with skilled student interns, technical co-founders, or specialized mentors to complement your skill set.",
      },
    ],
  },
  {
    title: "Program Structure & Incubation Journey",
    items: [
      {
        id: "prog-1",
        question: "How long does the incubation program last, and what are the phases?",
        answer:
          "The formal incubation lifecycle spans 12 calendar months, divided into three structured phases: Phase 1: Business Modeling & Validation (Months 1–3), focusing on market research, legal registration, and value proposition testing; Phase 2: Acceleration & Product Refinement (Months 4–9), focusing on prototyping, financial structuring, and pilot testing; and Phase 3: Commercialization & Market Access (Months 10–12), focusing on client acquisition, investor pitch preparation, and formal launch.",
      },
      {
        id: "prog-2",
        question: "What level of weekly commitment is expected from incubatees?",
        answer:
          "Selected founders are expected to dedicate a minimum of 15 to 20 hours per week to incubator-led activities. This includes mandatory attendance at bi-weekly masterclasses, one-on-one progress reviews with dedicated business advisors, milestone tracking sessions, and scheduled pitch evaluations.",
      },
      {
        id: "prog-3",
        question: "What happens if a startup fails to meet its performance milestones?",
        answer:
          "Progress is continuously monitored through structured quarterly reviews. If a venture falls behind on key performance indicators (KPIs), our advisory team will implement a 30-day corrective action plan to address operational bottlenecks. Continued non-performance or lack of engagement may result in formal offboarding to free up physical and financial resources for waiting list applicants.",
      },
    ],
  },
  {
    title: "Funding, Resources & Intellectual Property",
    items: [
      {
        id: "fin-1",
        question: "Does the Incubation Center provide direct cash investment or seed grants?",
        answer:
          "The center does not act as a direct commercial lending institution or equity fund. Instead, we assist incubatees in preparing competitive application packages for non-repayable seed micro-grants, prototype development funds, and equipment sponsorship through external government agencies (such as SEDA, SEFA, and NYDA), corporate enterprise development funds, and private venture partners.",
      },
      {
        id: "fin-2",
        question: "Who owns the Intellectual Property (IP) generated during incubation?",
        answer:
          "100% of the Intellectual Property, patents, code, trade secrets, and brand equity developed by the founder or founding team remains the exclusive property of the entrepreneur. Maluti TVET College takes zero equity and claims no ownership rights over incubatee businesses created within the program.",
      },
      {
        id: "fin-3",
        question: "What physical facilities and hardware tools do incubatees receive access to?",
        answer:
          "Accepted entrepreneurs gain full access to our co-working facilities, including high-speed fiber internet, dedicated hot-desking, private meeting rooms for client presentations, printing/scanning services, digital fabrication equipment, software development environments, and secure storage facilities across operating campus hubs.",
      },
      {
        id: "fin-4",
        question: "Are there any fees associated with joining or using the incubator services?",
        answer:
          "No. All core incubation services—including office space usage, internet connectivity, legal guidance, accounting mentorship, and masterclasses—are provided free of charge to approved Maluti TVET College students, alumni, and community incubatees as part of our regional economic growth mandate.",
      },
    ],
  },
];

export default function FaqsPage() {
  const [openFaqId, setOpenFaqId] = useState<string | null>("gen-1");

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <main className="bg-white text-black min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left Column: Fixed Header Overview */}
          <div className="lg:col-span-4 lg:sticky lg:top-12 space-y-4">
            <span className="text-xs font-semibold tracking-wider text-sky-600 uppercase">
              Support & Knowledge Base
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
              Frequently Asked Questions
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              Detailed guidance regarding admission standards, program structure, legal compliance, funding pathways, and physical resources at the Maluti TVET College Incubation Center.
            </p>
            
            <div className="pt-6 border-t border-gray-100 space-y-3">
              <p className="text-xs font-medium text-gray-500">
                Have a specific question not covered here?
              </p>
              <a
                href="mailto:incubation@malutitvet.edu.za"
                className="inline-flex items-center text-xs font-semibold text-sky-600 hover:text-sky-700 transition-colors"
              >
                Contact incubation@malutitvet.edu.za &rarr;
              </a>
            </div>
          </div>

          {/* Right Column: Comprehensive Categorized Accordions */}
          <div className="lg:col-span-8 space-y-12">
            {FAQ_SECTIONS.map((section) => (
              <div key={section.title} className="space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-sky-600 mb-3">
                  {section.title}
                </h2>

                <div className="border-t border-gray-200">
                  {section.items.map((faq) => {
                    const isOpen = openFaqId === faq.id;
                    return (
                      <div key={faq.id} className="border-b border-gray-200">
                        <button
                          onClick={() => toggleFaq(faq.id)}
                          className="w-full text-left py-5 flex items-center justify-between gap-4 focus:outline-none hover:text-sky-600 transition-colors"
                        >
                          <span className="font-semibold text-black text-sm sm:text-base pr-2">
                            {faq.question}
                          </span>
                          <svg
                            className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
                              isOpen ? "rotate-180 text-sky-600" : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>

                        <div
                          className={`grid transition-[grid-template-rows] duration-200 ease-in-out ${
                            isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <p className="pb-5 text-sm text-gray-600 leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </main>
  );
}