import "./ExploreFeature.css";

interface ExploreFeatureProps {
  id?: string;
}

export default function ExploreFeature({
  id = "explore-feature",
}: ExploreFeatureProps) {
  return (
    <section id={id} className="explore-feature-section">
      <div className="explore-feature-container">
        {/* Top Header */}
        <header className="explore-feature-header">
          <span className="explore-feature-eyebrow">Features and Releases</span>
          <h2 className="explore-feature-title">Explore what's new.</h2>
          <p className="explore-feature-subtitle">
            Discover the latest product features from Adobe.
          </p>
        </header>

        {/* Feature Image Card Container */}
        <div className="explore-feature-card">
          <img
            src="https://images.pexels.com/photos/8761333/pexels-photo-8761333.jpeg"
            alt="Feature preview showcase"
            className="explore-feature-card-img"
          />
        </div>

        {/* Bottom Feature Description & Action */}
        <div className="explore-feature-footer">
          <div className="explore-footer-text">
            <h3 className="explore-footer-title">
              Turn AI signals into business impact with Adobe Brand Visibility.
            </h3>
            <p className="explore-footer-caption">
              Get the intelligence and tools to win customers in AI searches.
            </p>
          </div>
          <a href="#learn-more" className="explore-footer-link">
            Learn more <span className="explore-footer-arrow">&gt;</span>
          </a>
        </div>
      </div>
    </section>
  );
}