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
          src="/images/team.jpg"
          alt="Modern warm kitchen background with Ouaken bin"
          className="ouaken-hero-bg-img"
        />
        <div className="ouaken-hero-overlay" />
      </div>

      <div className="ouaken-hero-container">
        {/* Left Headline & Action Group */}
        <div className="ouaken-hero-left">
          <h1 className="ouaken-hero-title">
            The bar?
            We raise that.
          </h1>
          <p className="ouaken-hero-description">
            We obsess over every. little. detail. In everything we do, we hold ourselves to the very highest of standards.
          </p>
          <div className="ouaken-hero-cta-group">
            <a href="/about" className="ouaken-hero-btn-primary">
              Learn more about Maluti CFERI
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}