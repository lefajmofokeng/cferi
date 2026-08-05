import Link from "next/link";

export default async function MentorshipProgrammePage() {
  const benefits = [
    {
      title: "1-on-1 Personalized Guidance",
      description: "Get tailored advice, actionable feedback, and a personalized roadmap focused directly on your career goals.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
          <circle cx="12" cy="12" r="6" strokeWidth="2" />
          <circle cx="12" cy="12" r="2" strokeWidth="2" />
        </svg>
      )
    },
    {
      title: "Skill Development",
      description: "Master modern industry standards, best practices, and practical technical execution with guided projects.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      title: "Portfolio & Code Reviews",
      description: "Refine your production-grade work with in-depth technical critiques to showcase your best self to employers.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      )
    },
    {
      title: "Exclusive Network",
      description: "Connect with dedicated industry peers, join interactive workshops, and gain access to high-impact career opportunities.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    }
  ];

  const tracks = [
    {
      tag: "Foundations",
      title: "Accelerated Frontend & Web Architecture",
      duration: "8 Weeks",
      level: "Beginner to Intermediate",
      topics: ["Modern JavaScript & React", "Responsive Layout Engineering", "UI/UX & Accessibility Standards"]
    },
    {
      tag: "Advanced",
      title: "Full-Stack System Design & DevOps",
      duration: "12 Weeks",
      level: "Intermediate to Advanced",
      topics: ["API Architecture & Database Design", "CI/CD & Cloud Deployment", "Performance Optimization"]
    }
  ];

  const steps = [
    {
      num: "01",
      title: "Submit Application",
      desc: "Tell us about your background, career aspirations, and where you need direct guidance."
    },
    {
      num: "02",
      title: "Mentor Match",
      desc: "We pair you with an experienced industry professional tailored specifically to your track."
    },
    {
      num: "03",
      title: "Growth & Execution",
      desc: "Begin structured weekly sessions, complete practical challenges, and level up your career."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-blue-500 selection:text-white">
      {/* Background Decorator */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] pointer-events-none" />

      <main className="relative z-10 mx-auto max-w-6xl px-6 py-16 md:py-24 space-y-28">
        
        {/* HERO SECTION */}
        <section className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <span>✨</span>
            Applications Now Open
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Accelerate your growth with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-400 to-indigo-400">1-on-1 Mentorship</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 leading-relaxed">
            Gain real-world insights, level up your engineering capabilities, and navigate your tech career with direct support from seasoned builders.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#apply"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-500/35 hover:-translate-y-0.5"
            >
              Apply for Mentorship
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <Link
              href="#tracks"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800/80 text-slate-300 font-semibold transition-all hover:text-white"
            >
              Explore Tracks
            </Link>
          </div>
        </section>

        {/* PROGRAMME BENEFITS */}
        <section className="space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Why Join the Programme?</h2>
            <p className="text-slate-400 text-sm md:text-base">Designed to help you bridge the gap between foundational knowledge and production experience.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((item, index) => (
              <div 
                key={index} 
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 backdrop-blur-sm transition-all hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* MENTORSHIP TRACKS */}
        <section id="tracks" className="space-y-12 scroll-mt-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Structured Pathways</h2>
            <p className="text-slate-400 text-sm md:text-base">Choose a targeted track tailored to your current skills and career stage.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tracks.map((track, idx) => (
              <div 
                key={idx} 
                className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 transition-all space-y-6 relative overflow-hidden flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-md bg-slate-800 text-blue-400 text-xs font-semibold">
                      {track.tag}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {track.duration}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{track.title}</h3>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Level: {track.level}</p>
                  
                  <hr className="border-slate-800" />
                  
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-slate-300">Key Focus Areas:</p>
                    <ul className="space-y-2">
                      {track.topics.map((topic, tIdx) => (
                        <li key={tIdx} className="flex items-center gap-2.5 text-sm text-slate-400">
                          <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Link
                  href="#apply"
                  className="w-full text-center py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition-colors block mt-6"
                >
                  Select Track
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">How the Process Works</h2>
            <p className="text-slate-400 text-sm md:text-base">Three simple steps to start your structured mentorship journey.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, sIdx) => (
              <div key={sIdx} className="space-y-4 p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60 relative">
                <span className="text-4xl font-extrabold text-blue-500/20">{step.num}</span>
                <h3 className="text-lg font-bold text-white">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA BANNER */}
        <section id="apply" className="rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900 border border-blue-500/30 p-8 md:p-12 text-center space-y-6 relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Ready to take the next step?</h2>
            <p className="text-slate-300 text-sm md:text-base">
              Spaces are intentionally limited to ensure high-quality 1-on-1 focus for every participant.
            </p>
            <div className="pt-2">
              <Link 
                href="/apply"
                className="inline-block px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-lg shadow-blue-600/30 hover:-translate-y-0.5"
              >
                Apply for Next Cohort
              </Link>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}