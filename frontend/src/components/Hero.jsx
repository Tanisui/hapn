import './Hero.css';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>
          Discover local gems from <span className="highlight">MSMEs</span> in Davao City
        </h1>
        <p className="hero-subtitle">
          Shop unique products from local merchants, attend events, and support small businesses — all in one platform.
        </p>
        <button className="hero-btn">Shop Now</button>
      </div>
      <div className="hero-image">
        <div className="hero-image-placeholder">
          <span className="hero-emoji">🛍️</span>
          <span className="hero-tagline">hap'n!</span>
        </div>
      </div>
    </section>
  );
}
