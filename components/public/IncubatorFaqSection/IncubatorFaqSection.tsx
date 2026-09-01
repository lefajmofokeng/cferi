import React from "react";
import "./IncubatorFaqSection.css";

const FAQ_SECTIONS = [
  {
    category: "01. Eligibility & Admission",
    items: [
      {
        question: "Who is eligible to join the Maluti TVET Rapid Incubator?",
        answer:
          "The program is open to registered Maluti TVET College students, alumni, and local youth entrepreneurs operating within the Thabo Mofutsanyana District / Qwaqwa region.",
      },
      {
        question: "Do I need a fully registered company before applying?",
        answer:
          "No. We accept early-stage ideas and pre-registration founders. Our team assists high-potential candidates with CIPC registration, tax compliance, and formal business structuring.",
      },
      {
        question: "What documents are required for the application process?",
        answer:
          "You will need a valid South African ID copy, proof of campus enrollment or local residency, a concise summary of your business idea, and any relevant trade or academic qualifications.",
      },
    ],
  },
  {
    category: "02. Incubation & Facilities",
    items: [
      {
        question: "What physical facilities are available at the Phuthaditjhaba hub?",
        answer:
          "Incubated founders receive access to high-speed internet, dedicated co-working desks, private meeting rooms, computer labs, and technical prototyping equipment tailored for trade and digital ventures.",
      },
      {
        question: "How long does the incubation program last?",
        answer:
          "Programs typically range from 12 to 24 months, depending on your business sector, product development stage, and milestone completion velocity.",
      },
      {
        question: "Can I participate in mentorship while taking classes?",
        answer:
          "Yes. Mentorship schedules are flexible and structured around TVET academic timetables with after-hours, weekend, and virtual options.",
      },
    ],
  },
  {
    category: "03. Funding & Resources",
    items: [
      {
        question: "Does the incubator provide direct cash grants or loans?",
        answer:
          "The incubator does not directly disburse cash or take equity. However, we prepare founders for funding opportunities and directly facilitate grant access through partners like Seda and NYDA.",
      },
      {
        question: "How do bi-annual Pitch Days work for incubated ventures?",
        answer:
          "Twice a year, pitch-ready incubator startups showcase their business models to local enterprise finance agencies, private investors, and supply chain procurement teams.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <main className="faq-page-light">
      <div className="faq-layout">
        <header className="faq-page-header">
          <h1 className="faq-main-title">FAQS</h1>
        </header>

        <div className="faq-sections-container">
          {FAQ_SECTIONS.map((section, sIdx) => (
            <section key={sIdx} className="faq-category-block">
              <h2 className="faq-category-name">{section.category}</h2>

              <div className="faq-accordion-group">
                {section.items.map((item, iIdx) => (
                  <details key={iIdx} className="faq-row">
                    <summary className="faq-trigger">
                      <span className="faq-question">{item.question}</span>
                      <span className="faq-icon" aria-hidden="true" />
                    </summary>
                    <div className="faq-content">
                      <p>{item.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}