import './Hero.css';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="display">
          discover local gems from <span className="highlight">MSMEs</span> in Davao City
        </h1>
        <p className="hero-subtitle">
          Shop unique products from local merchants, attend events, and support small businesses — all in one platform.
        </p>
        <button className="btn btn-primary hero-btn">Shop Now</button>
      </div>
      <div className="hero-image" aria-hidden="true">
        <div className="card hero-card">
          <span className="hero-emoji">🛍️</span>
          <span className="hero-tagline">hap'n!</span>
        </div>
      </div>
    </section>
  );
}
