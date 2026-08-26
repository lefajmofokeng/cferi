"use client";

import React, { useState } from "react";

interface GuideStep {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  checklist: string[];
}

const APPLICATION_STEPS: GuideStep[] = [
  {
    number: "01",
    title: "Eligibility Check",
    subtitle: "Confirm prerequisites before applying",
    description:
      "Our incubation program is open to registered Maluti TVET students, recent alumni, and local community entrepreneurs seeking to commercialize technical or vocational ventures.",
    checklist: [
      "Valid South African ID or registered student/alumnus number",
      "An active technical, vocational, or service-based business concept",
      "Commitment to participate in hybrid mentorship and workshops",
    ],
  },
  {
    number: "02",
    title: "Document Preparation",
    subtitle: "Assemble required verification materials",
    description:
      "Ensure all supporting documentation is updated and digitized in PDF format prior to starting your online submission.",
    checklist: [
      "Certified copy of South African ID",
      "Proof of student enrollment or highest qualification certificate",
      "Comprehensive Business Plan or 1-page Business Model Canvas",
      "Proof of residence or business operational address",
      "CIPC incorporation certificate (if already registered)",
    ],
  },
  {
    number: "03",
    title: "Online Submission",
    subtitle: "Complete the portal application",
    description:
      "Submit your venture details through the Maluti TVET Incubation Portal. Take time to articulate your problem statement, target market, and technical assistance needs.",
    checklist: [
      "Fill out company and founder profile details",
      "Upload digitized verification documents",
      "Specify your target outcome (e.g., prototyping, funding, registration)",
    ],
  },
  {
    number: "04",
    title: "Pitch & Evaluation",
    subtitle: "Present to the advisory panel",
    description:
      "Shortlisted candidates are invited to deliver a 10-minute presentation to the Incubation Advisory Committee, followed by a Q&A session.",
    checklist: [
      "Prepare a concise 10-slide pitch deck",
      "Demonstrate product prototypes, mockups, or proof of concept",
      "Outline immediate resource requirements and growth targets",
    ],
  },
  {
    number: "05",
    title: "Onboarding & Contracting",
    subtitle: "Formal admission into the center",
    description:
      "Accepted startups sign an Incubation Agreement, gaining immediate access to physical workspace, cloud resources, assigned mentors, and development pathways.",
    checklist: [
      "Sign program participation terms and confidentiality agreement",
      "Attend mandatory orientation session",
      "Meet your assigned technical and business mentor",
    ],
  },
];

const FAQ_ITEMS = [
  {
    question: "Is there an application fee for the incubation program?",
    answer:
      "No. Program participation is fully subsidized for Maluti TVET students, alumni, and selected local youth entrepreneurs.",
  },
  {
    question: "Do I need a fully registered company before applying?",
    answer:
      "Not required. Early-stage ideas and unregistered ventures are welcome. We assist accepted incubatees with formal CIPC incorporation and tax compliance.",
  },
  {
    question: "How long does the selection review process take?",
    answer:
      "Applications are reviewed on a rolling basis. You will receive initial status feedback within 10 business days after submission.",
  },
];

export default function ApplicationGuidePage() {
  const [activeStep, setActiveStep] = useState<string>("01");

  return (
    <main className="bg-white text-black min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* Left Column: Fixed Overview & Fast Track Navigation */}
          <div className="lg:col-span-4 lg:sticky lg:top-16 space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-medium tracking-widest text-sky-500 uppercase">
                Incubation Program
              </span>
              <h1 className="text-3xl font-bold text-black sm:text-4xl tracking-tight">
                Application Guide
              </h1>
              <p className="text-sm text-gray-500 leading-relaxed">
                Step-by-step instructions to prepare, submit, and pitch your startup idea for admission into the Maluti TVET College Incubation Center.
              </p>
            </div>

            {/* Step Quick Jump Links */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
                Jump to Phase
              </span>
              <nav className="flex flex-col space-y-1">
                {APPLICATION_STEPS.map((step) => (
                  <button
                    key={step.number}
                    onClick={() => {
                      setActiveStep(step.number);
                      const element = document.getElementById(`step-${step.number}`);
                      element?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`text-left text-xs font-semibold transition-colors py-1 ${
                      activeStep === step.number
                        ? "text-sky-500 font-bold"
                        : "text-gray-400 hover:text-black"
                    }`}
                  >
                    {step.number} — {step.title}
                  </button>
                ))}
              </nav>
            </div>

            <div className="pt-4 space-y-2">
              <p className="text-xs text-gray-400">Ready to apply?</p>
              <a
                href="/apply"
                className="inline-block text-xs font-bold text-sky-500 hover:text-sky-600 transition-colors"
              >
                Start Online Application &rarr;
              </a>
            </div>
          </div>

          {/* Right Column: Clean Process Timeline */}
          <div className="lg:col-span-8 space-y-16">
            
            {/* Step List */}
            <div className="space-y-16">
              {APPLICATION_STEPS.map((step) => (
                <section
                  key={step.number}
                  id={`step-${step.number}`}
                  className="space-y-4 scroll-mt-16"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-sky-500 tracking-wider">
                      PHASE {step.number}
                    </span>
                    <h2 className="text-xl font-bold text-black tracking-tight">
                      {step.title}
                    </h2>
                    <p className="text-xs font-medium text-gray-400">
                      {step.subtitle}
                    </p>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed">
                    {step.description}
                  </p>

                  <div className="pt-2 space-y-2">
                    <span className="text-xs font-semibold text-black tracking-wide">
                      Requirements & Deliverables:
                    </span>
                    <ul className="space-y-2">
                      {step.checklist.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start text-xs text-gray-500 leading-relaxed"
                        >
                          <span className="text-sky-500 mr-2 font-bold">—</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              ))}
            </div>

            {/* Frequently Asked Questions */}
            <div className="pt-8 space-y-8">
              <div className="space-y-1">
                <span className="text-xs font-bold text-sky-500 tracking-wider uppercase">
                  Support
                </span>
                <h2 className="text-lg font-bold text-black">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="space-y-6">
                {FAQ_ITEMS.map((faq, idx) => (
                  <div key={idx} className="space-y-1">
                    <h3 className="text-sm font-semibold text-black">
                      {faq.question}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}