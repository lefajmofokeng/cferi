"use client";

import React, { useState, useMemo } from "react";

interface GlossaryTerm {
  id: string;
  term: string;
  category: "Business" | "Technology" | "Compliance" | "Finance" | "Incubation";
  definition: string;
}

const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: "term-1",
    term: "Acceleration Phase",
    category: "Incubation",
    definition:
      "The secondary stage of the incubation lifecycle focused on rapid scaling, operational execution, market testing, and commercial client acquisition after initial business concept validation.",
  },
  {
    id: "term-2",
    term: "Angel Investor",
    category: "Finance",
    definition:
      "A high-net-worth individual who provides private capital to early-stage startups, typically in exchange for convertible debt or equity ownership, offering strategic guidance alongside funding.",
  },
  {
    id: "term-3",
    term: "Business Model Canvas (BMC)",
    category: "Business",
    definition:
      "A strategic management template used for developing new business models or documenting existing ones. It visualizes nine key building blocks, including value propositions, customer segments, channels, and revenue streams.",
  },
  {
    id: "term-4",
    term: "CIPC Registration",
    category: "Compliance",
    definition:
      "The formal legal incorporation of a business entity with the Companies and Intellectual Property Commission in South Africa, granting legal personality, tax compliance eligibility, and operational legitimacy.",
  },
  {
    id: "term-5",
    term: "COIDA",
    category: "Compliance",
    definition:
      "Compensation for Occupational Injuries and Diseases Act. A mandatory South African regulatory fund that protects employers and employees in the event of workplace accidents, injuries, or occupational diseases.",
  },
  {
    id: "term-6",
    term: "Commercialization",
    category: "Business",
    definition:
      "The systematic process of introducing a newly developed product, technology, or service into the open market to generate sustainable revenue streams and scale operations.",
  },
  {
    id: "term-7",
    term: "Digital Prototyping",
    category: "Technology",
    definition:
      "The creation of interactive digital mockups, wireframes, or software MVPs to test user interface design, application logic, and workflow feasibility prior to full-scale technical production.",
  },
  {
    id: "term-8",
    term: "Enterprise Development Fund",
    category: "Finance",
    definition:
      "Corporate or government initiatives designed to support small, micro, and medium enterprises (SMMEs) through grant funding, infrastructure access, or preferential supply chain opportunities.",
  },
  {
    id: "term-9",
    term: "Incubatee",
    category: "Incubation",
    definition:
      "An entrepreneur, founder, or student startup team formally admitted into an incubator program to receive operational guidance, mentorship, infrastructure access, and advisory support.",
  },
  {
    id: "term-10",
    term: "Intellectual Property (IP)",
    category: "Compliance",
    definition:
      "Intangible assets resulting from human creativity, such as patents, copyrights, trademarks, software code, and trade secrets, legally protected to prevent unauthorized commercial usage.",
  },
  {
    id: "term-11",
    term: "Minimum Viable Product (MVP)",
    category: "Technology",
    definition:
      "A simplified version of a product built with core features sufficient to attract early adopters, validate business hypotheses, and collect user feedback for iterative product development.",
  },
  {
    id: "term-12",
    term: "NYDA Micro-Grant",
    category: "Finance",
    definition:
      "Financial grant funding administered by the National Youth Development Agency in South Africa to assist youth-owned micro-enterprises with capital equipment, materials, or operational startup costs.",
  },
  {
    id: "term-13",
    term: "Pitch Deck",
    category: "Business",
    definition:
      "A concise slide presentation used by founders to outline their business model, market opportunity, problem-solution fit, financial projections, and funding requirements to investors or competition panels.",
  },
  {
    id: "term-14",
    term: "Rapid Incubation",
    category: "Incubation",
    definition:
      "An intensive, time-bound incubation methodology that accelerates technical skill development, product prototyping, and market entry for vocational and technical entrepreneurs.",
  },
  {
    id: "term-15",
    term: "SARS Tax Clearance",
    category: "Compliance",
    definition:
      "An official certificate issued by the South African Revenue Service verifying that a registered business has no outstanding tax liabilities and complies with national tax legislation.",
  },
  {
    id: "term-16",
    term: "Seed Funding",
    category: "Finance",
    definition:
      "The initial capital utilized by an early-stage startup to cover basic operational costs, initial product development, market research, and core team compensation before generating organic revenue.",
  },
  {
    id: "term-17",
    term: "SEDA / SEFA",
    category: "Incubation",
    definition:
      "South African state agencies (Small Enterprise Development Agency & Small Enterprise Finance Agency) that provide non-financial business support, training, loans, and sector development programs to SMMEs.",
  },
  {
    id: "term-18",
    term: "SMME",
    category: "Business",
    definition:
      "Small, Medium, and Micro Enterprises. A key classification within the South African economy comprising registered businesses across various revenue tiers, driving localized employment and industrial innovation.",
  },
  {
    id: "term-19",
    term: "Value Proposition",
    category: "Business",
    definition:
      "A clear statement that summarizes why a consumer should purchase a product or service, detailing the specific benefits, problem-solving capabilities, and unique advantages over existing competitors.",
  },
  {
    id: "term-20",
    term: "Venture Validation",
    category: "Incubation",
    definition:
      "The process of rigorously testing business assumptions through customer interviews, pilot programs, and market experiments to confirm real-world demand before investing capital.",
  },
];

const ALPHABET = [
  "ALL",
  "A", "B", "C", "D", "E", "F", "G", "H", "I", 
  "J", "K", "L", "M", "N", "O", "P", "Q", "R", 
  "S", "T", "U", "V", "W", "X", "Y", "Z"
];

export default function GlossaryPage() {
  const [selectedLetter, setSelectedLetter] = useState("ALL");

  const filteredTerms = useMemo(() => {
    if (selectedLetter === "ALL") return GLOSSARY_TERMS;
    return GLOSSARY_TERMS.filter((t) =>
      t.term.toUpperCase().startsWith(selectedLetter)
    );
  }, [selectedLetter]);

  // Group terms by initial letter for clean display
  const groupedTerms = useMemo(() => {
    const sorted = [...filteredTerms].sort((a, b) =>
      a.term.localeCompare(b.term)
    );
    return sorted.reduce((acc, term) => {
      const letter = term.term[0].toUpperCase();
      if (!acc[letter]) acc[letter] = [];
      acc[letter].push(term);
      return acc;
    }, {} as Record<string, GlossaryTerm[]>);
  }, [filteredTerms]);

  return (
    <main className="bg-white text-black min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left Column: Heading Overview */}
          <div className="lg:col-span-4 lg:sticky lg:top-12 space-y-4">
            <span className="text-xs font-semibold tracking-wider text-sky-600 uppercase">
              Knowledge Base
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
              Incubation Glossary
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              A comprehensive directory of key terminology across entrepreneurship, business compliance, venture finance, and technical incubation at Maluti TVET College.
            </p>

            <div className="pt-6 border-t border-gray-100 space-y-3">
              <p className="text-xs font-medium text-gray-500">
                Need clarification on a term not listed?
              </p>
              <a
                href="mailto:incubation@malutitvet.edu.za"
                className="inline-flex items-center text-xs font-semibold text-sky-600 hover:text-sky-700 transition-colors"
              >
                Inquire with an Advisor &rarr;
              </a>
            </div>
          </div>

          {/* Right Column: Filter Bar & Glossary Definitions */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Alphabet Filter Navigation */}
            <div className="border-b border-gray-200 pb-4">
              <div className="flex flex-wrap gap-1">
                {ALPHABET.map((letter) => {
                  const isActive = selectedLetter === letter;
                  return (
                    <button
                      key={letter}
                      onClick={() => setSelectedLetter(letter)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                        isActive
                          ? "bg-sky-50 text-sky-600"
                          : "text-gray-500 hover:text-black hover:bg-gray-50"
                      }`}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Alphabetically Grouped Terms */}
            {Object.keys(groupedTerms).length > 0 ? (
              <div className="space-y-10">
                {Object.entries(groupedTerms).map(([letter, terms]) => (
                  <div key={letter} className="space-y-3">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-sky-600 border-b border-gray-100 pb-1">
                      {letter}
                    </h2>

                    <div className="divide-y divide-gray-100">
                      {terms.map((item) => (
                        <div key={item.id} className="py-4 space-y-1.5">
                          <div className="flex items-center justify-between gap-4">
                            <h3 className="font-semibold text-black text-base">
                              {item.term}
                            </h3>
                            <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                              {item.category}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {item.definition}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center border-b border-gray-200">
                <p className="text-sm text-gray-500 font-medium">
                  No terminology found matching letter &quot;{selectedLetter}&quot;.
                </p>
                <button
                  onClick={() => setSelectedLetter("ALL")}
                  className="mt-2 text-xs font-semibold text-sky-600 hover:underline"
                >
                  View all terms &rarr;
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </main>
  );
}