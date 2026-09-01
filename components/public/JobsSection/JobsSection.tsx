import "./JobsSection.css";

interface JobsProps {
  id?: string;
}

export default function Jobs({ id = "jobs" }: JobsProps) {
  return (
    <div id={id} className="mtc-incubator-page">
      {/* 1. Hero Section */}
      <section className="mtc-hero-section">
        <div className="mtc-hero-container">
          <div className="mtc-hero-content">
            <h1 className="mtc-hero-title">
              Empowering the next generation of entrepreneurs.
            </h1>
            <p className="mtc-hero-desc">
              Turn your business idea into a thriving enterprise. The Maluti TVET College Centre for Entrepreneurship Rapid Incubator provides seed support, mentorship, and technical infrastructure for innovative startups across the Free State.
            </p>
            <a href="#apply" className="mtc-btn mtc-btn-blue">
              Apply for incubation
            </a>
          </div>
          <div className="mtc-hero-media">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop"
              alt="Maluti TVET College Incubator student founders collaborating"
              className="mtc-hero-img"
            />
          </div>
        </div>
      </section>

      {/* 2. Intro Section */}
      <section className="mtc-intro-section">
        <div className="mtc-intro-container">
          <h2 className="mtc-intro-title">
            Accelerating student & community startups.
          </h2>
          <p className="mtc-intro-desc">
            We bridge the gap between vocational skills and real-world business ownership. From initial ideation to market launch, our incubator equips founders with practical tools, office space, and industry networks.
          </p>
          <a href="#programs" className="mtc-btn mtc-btn-outline">
            Explore our programs
          </a>
        </div>
      </section>

      {/* 3. Alternating / Zigzag Feature Rows */}
      <section className="mtc-features-section">
        <div className="mtc-features-container">
          {/* Row 1: Image Left, Text Right */}
          <div className="mtc-feature-row">
            <div className="mtc-feature-media">
              <img
                src="https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?q=80&w=1000&auto=format&fit=crop"
                alt="Incubator mentorship session"
              />
            </div>
            <div className="mtc-feature-content">
              <h3 className="mtc-feature-title">
                1-on-1 Expert Mentorship
              </h3>
              <p className="mtc-feature-desc">
                Get paired with seasoned entrepreneurs, financial advisors, and technical specialists who provide step-by-step guidance tailored to your business model.
              </p>
              <a href="#mentorship" className="mtc-feature-link">
                Learn about mentorship &gt;
              </a>
            </div>
          </div>

          {/* Row 2: Text Left, Image Right */}
          <div className="mtc-feature-row mtc-feature-reverse">
            <div className="mtc-feature-media">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop"
                alt="Modern co-working space and rapid prototyping lab"
              />
            </div>
            <div className="mtc-feature-content">
              <h3 className="mtc-feature-title">
                Co-Working & Prototyping Labs
              </h3>
              <p className="mtc-feature-desc">
                Access fully equipped work hubs, high-speed internet, meeting rooms, and specialized rapid prototyping resources to build and test your products.
              </p>
              <a href="#facilities" className="mtc-feature-link">
                Tour our facilities &gt;
              </a>
            </div>
          </div>

          {/* Row 3: Image Left, Text Right */}
          <div className="mtc-feature-row">
            <div className="mtc-feature-media">
              <img
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1000&auto=format&fit=crop"
                alt="Business pitch presentation"
              />
            </div>
            <div className="mtc-feature-content">
              <h3 className="mtc-feature-title">
                Funding Readiness & Market Access
              </h3>
              <p className="mtc-feature-desc">
                Prepare your venture for investment. Pitch directly to government funding bodies, angel investors, and commercial partners through our pitch events.
              </p>
              <a href="#funding" className="mtc-feature-link">
                View funding opportunities &gt;
              </a>
            </div>
          </div>

          {/* Row 4: Text Left, Image Right */}
          <div className="mtc-feature-row mtc-feature-reverse">
            <div className="mtc-feature-media">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop"
                alt="Incubation alumni startup founders"
              />
            </div>
            <div className="mtc-feature-content">
              <h3 className="mtc-feature-title">
                Vibrant Founder Community
              </h3>
              <p className="mtc-feature-desc">
                Join a dynamic network of student entrepreneurs, TVET graduates, and local innovators. Collaborate, share insights, and grow together.
              </p>
              <a href="#community" className="mtc-feature-link">
                Meet our alumni startups &gt;
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Red Accent Spotlight Banner */}
      <section className="mtc-quiz-banner">
        <div className="mtc-quiz-container">
          <div className="mtc-quiz-content">
            <h2 className="mtc-quiz-title">Have a business idea ready to grow?</h2>
            <p className="mtc-quiz-desc">
              Applications for the next Maluti TVET College Incubation Cohort are now open. Take the readiness assessment and pitch your project today.
            </p>
            <a href="#assessment" className="mtc-btn mtc-btn-white-outline">
              Take incubation assessment
            </a>
          </div>
        </div>
      </section>

      {/* 5. Dark Call to Action */}
      <section className="mtc-dark-cta-section">
        <div className="mtc-dark-cta-container">
          <h2 className="mtc-dark-cta-title">Build your legacy with us.</h2>
          <p className="mtc-dark-cta-desc">
            Explore incubation intakes, mentorship roles, and enterprise development partnerships.
          </p>
          <a href="#apply" className="mtc-btn mtc-btn-blue">
            Join the Incubator
          </a>
        </div>
      </section>

      {/* 6. Footer Statement */}
      <footer className="mtc-equal-footer">
        <div className="mtc-equal-container">
          <h4 className="mtc-equal-title">Maluti TVET College Centre for Entrepreneurship</h4>
          <p className="mtc-equal-text">
            The Centre for Entrepreneurship Rapid Incubator is committed to fostering economic growth and enterprise development within Qwaqwa and the broader Free State region.
          </p>
          <div className="mtc-brand-tagline">
            Let's <span>Build</span> together.
          </div>
        </div>
      </footer>
    </div>
  );
}