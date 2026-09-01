import React from "react";
import "./IncubatorRoadmapSection.css";

const ROADMAP_DATA = [
  {
    id: "era-1",
    label: "2015 - 2018",
    events: [
      {
        period: "2015",
        title: "Center Establishment",
        description:
          "Maluti TVET College partnered with the Small Enterprise Development Agency (Seda) to lay the groundwork for the Centre for Entrepreneurship.",
      },
      {
        period: "2016",
        title: "Infrastructure Launch",
        description:
          "Opened initial office space and mentorship hubs at the Phuthaditjhaba campus to support vocational student founders.",
      },
      {
        period: "2017",
        title: "First Student Cohort",
        description:
          "Inducted the inaugural pilot group of 30 TVET student entrepreneurs in technical trade and service sectors.",
      },
      {
        period: "2018",
        title: "Rapid Incubator Expansion",
        description:
          "Officially designated as a Rapid Incubator, integrating rapid prototyping tools and technical equipment access.",
      },
    ],
  },
  {
    id: "era-2",
    label: "2019 - 2021",
    events: [
      {
        period: "2019",
        title: "Prototyping Lab Upgrade",
        description:
          "Installed modern production machinery and IT hubs to enable fast physical product testing for local startups.",
      },
      {
        period: "2020",
        title: "Digital Business Resilience",
        description:
          "Transitioned mentorship programs into hybrid virtual workshops to keep incubated startups active during pandemic shifts.",
      },
      {
        period: "2021",
        title: "Community SME Access",
        description:
          "Expanded incubator enrollment beyond students to include promising youth-owned small businesses across Qwaqwa.",
      },
    ],
  },
  {
    id: "era-3",
    label: "2022 - 2024",
    events: [
      {
        period: "2022",
        title: "Enterprise Funding Days",
        description:
          "Launched bi-annual investor and government pitch days, connecting incubator founders directly with seed capital sources.",
      },
      {
        period: "2023",
        title: "Tech Startup Accelerator",
        description:
          "Introduced dedicated digital track support for software, web development, and digital marketing ventures.",
      },
      {
        period: "2024",
        title: "Regional Trade Partnerships",
        description:
          "Forged commercial ties with regional chambers of commerce and private industry for direct supply-chain integration.",
      },
    ],
  },
  {
    id: "era-4",
    label: "2025 - 2026+",
    events: [
      {
        period: "2025",
        title: "Digital Management Portal",
        description:
          "Rolled out an integrated cloud platform for tracking founder milestones, incubation metrics, and mentorship logs.",
      },
      {
        period: "2026",
        title: "Green & Smart Economy Track",
        description:
          "Launched dedicated incubation pathways focusing on renewable energy, sustainable agriculture, and smart tech.",
      },
      {
        period: "Future",
        title: "Free State Innovation Network",
        description:
          "Positioning the center as the central enterprise hub connecting rural TVET incubators across the Free State.",
      },
    ],
  },
];

export default function IncubatorRoadmapSection() {
  return (
    <div className="mtc-incubation-container">
      {/* 1. Pure Server Component Hero Video Section */}
      <section className="mtc-hero-video-section">
        <video
          className="mtc-hero-video"
          autoPlay
          loop
          muted
          playsInline
        >
          <source
            src="https://www.pexels.com/download/video/32147098/"
            type="video/mp4"
          />
        </video>

        <div className="mtc-hero-video-overlay" />

        {/* Pure CSS Control Switch */}
        <input
          type="checkbox"
          id="mtc-video-play-toggle"
          className="mtc-video-toggle-checkbox"
          defaultChecked
        />
        <label
          htmlFor="mtc-video-play-toggle"
          className="mtc-video-control-btn"
          aria-label="Toggle Video Playback Indicator"
        >
          <svg className="icon-pause" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
          <svg className="icon-play" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </label>

        <div className="mtc-hero-video-content">
          
          <h1 className="mtc-hero-video-title">
            Empowering Innovation & Enterprise
          </h1>
          <p className="mtc-hero-video-subtitle">
            Maluti TVET College Centre for Entrepreneurship Rapid Incubator
          </p>
        </div>
      </section>

      {/* 2. Pure CSS Interactive Roadmap Section */}
      <section className="mtc-roadmap-section">
        {ROADMAP_DATA.map((era, index) => (
          <input
            key={era.id}
            type="radio"
            name="mtc-roadmap-tab"
            id={era.id}
            className="mtc-tab-radio"
            defaultChecked={index === 0}
          />
        ))}

        <div className="mtc-roadmap-header">
          <h2 className="mtc-roadmap-title">Fostering Enterprise Since 2015.</h2>
          <p className="mtc-roadmap-subtitle">
            Explore key milestones in the Maluti TVET College Centre for Entrepreneurship 
            Rapid Incubator journey — from campus hub setup to empowering next-generation 
            founders across the Free State.
          </p>
        </div>

        <div className="mtc-tabs-wrapper">
          <div className="mtc-tabs-container">
            {ROADMAP_DATA.map((era) => (
              <label
                key={era.id}
                htmlFor={era.id}
                className={`mtc-tab-label ${era.id}`}
              >
                {era.label}
              </label>
            ))}
          </div>
          <div className="mtc-tabs-divider" />
        </div>

        <div className="mtc-roadmap-content">
          {ROADMAP_DATA.map((era) => (
            <div key={era.id} className={`mtc-events-grid mtc-panel-${era.id}`}>
              {era.events.map((event, idx) => (
                <article key={idx} className="mtc-event-card">
                  <span className="mtc-event-period">{event.period}</span>
                  <h3 className="mtc-event-heading">{event.title}</h3>
                  <p className="mtc-event-desc">{event.description}</p>
                </article>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}