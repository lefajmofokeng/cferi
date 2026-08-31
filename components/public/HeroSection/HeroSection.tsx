import "./HeroSection.css";

interface HeroSectionProps {
  id?: string;
}

export default function HeroSection({ id = "hero-section" }: HeroSectionProps) {
  return (
    <section id={id} className="ouaken-hero">
      {/* Background Image Container */}
      <div className="ouaken-hero-bg-wrapper">
        <img
          src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2000&auto=format&fit=crop"
          alt="Modern warm kitchen background with Ouaken bin"
          className="ouaken-hero-bg-img"
        />
        <div className="ouaken-hero-overlay" />
      </div>

      <div className="ouaken-hero-container">
        {/* Left Headline & Action Group */}
        <div className="ouaken-hero-left">
          <h1 className="ouaken-hero-title">
            Prevent food waste <br />
            the smart way
          </h1>
          <p className="ouaken-hero-description">
            With intelligent tech and a beautiful design, Mill makes compost
            pails and garbage disposals obsolete.
          </p>
          <div className="ouaken-hero-cta-group">
            <a href="#shop" className="ouaken-hero-btn-primary">
              Shop Ouaken
            </a>
            <a
              href="#explore"
              className="ouaken-hero-btn-icon"
              aria-label="Explore details"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
          </div>
        </div>

        {/* Right Floating Cards Grid */}
        <div className="ouaken-hero-right">
          <div className="ouaken-hero-cards-grid">
            {/* Featured Promo Card */}
            <div className="ouaken-card ouaken-card-promo">
              <div className="ouaken-card-promo-info">
                <h3 className="ouaken-card-title">
                  Prevent food waste <br />
                  the smart way
                </h3>
                <p className="ouaken-card-subtitle">
                  With intelligent tech and a beautiful design
                </p>
                <div className="ouaken-card-cta-row">
                  <a href="#learn-more" className="ouaken-card-btn">
                    Learn More
                  </a>
                  <span className="ouaken-card-btn-arrow">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </span>
                </div>
              </div>
              <div className="ouaken-card-promo-media">
                <img
                  src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600&auto=format&fit=crop"
                  alt="Ouaken Smart Bin Illustration"
                  className="ouaken-card-appliance-img"
                />
              </div>
            </div>

            {/* Bottom Left Card: 27/4 Home Delivery */}
            <div className="ouaken-card ouaken-card-stat">
              <div className="ouaken-card-map-pattern">
                <svg
                  viewBox="0 0 200 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ouaken-map-svg"
                >
                  <circle cx="20" cy="30" r="1.5" fill="#9ca3af" />
                  <circle cx="40" cy="25" r="1.5" fill="#d1d5db" />
                  <circle cx="60" cy="45" r="1.5" fill="#9ca3af" />
                  <circle cx="80" cy="35" r="1.5" fill="#d1d5db" />
                  <circle cx="100" cy="50" r="1.5" fill="#9ca3af" />
                  <circle cx="120" cy="20" r="1.5" fill="#d1d5db" />
                  <circle cx="140" cy="40" r="1.5" fill="#9ca3af" />
                  <circle cx="160" cy="30" r="1.5" fill="#d1d5db" />
                  <circle cx="180" cy="55" r="1.5" fill="#9ca3af" />
                  <circle cx="30" cy="60" r="1.5" fill="#d1d5db" />
                  <circle cx="70" cy="70" r="1.5" fill="#9ca3af" />
                  <circle cx="130" cy="65" r="1.5" fill="#d1d5db" />
                  <circle cx="150" cy="75" r="1.5" fill="#9ca3af" />
                </svg>
              </div>
              <div className="ouaken-card-stat-content">
                <span className="ouaken-card-big-num">27/4</span>
                <span className="ouaken-card-label">Home Delivery Service</span>
              </div>
            </div>

            {/* Bottom Right Card: Customer Social Proof */}
            <div className="ouaken-card ouaken-card-users">
              <div className="ouaken-card-users-top">
                <span className="ouaken-card-big-num">120K+</span>
              </div>
              <div className="ouaken-card-divider" />
              <div className="ouaken-card-avatars">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop"
                  alt="Customer 1"
                  className="ouaken-avatar-img"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"
                  alt="Customer 2"
                  className="ouaken-avatar-img"
                />
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop"
                  alt="Customer 3"
                  className="ouaken-avatar-img"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}