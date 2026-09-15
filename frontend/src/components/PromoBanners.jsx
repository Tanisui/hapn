import './PromoBanners.css';

export default function PromoBanners() {
  return (
    <section className="promo-banners">
      <div className="promo-card promo-red on-dark">
        <span className="pill">Up to 20% Off</span>
        <h3 className="display">support local<br />MSME products</h3>
        <p>Handpicked items from Davao's finest small businesses.</p>
        <button className="btn btn-ghost">Shop Now →</button>
      </div>
      <div className="promo-card promo-light">
        <span className="pill">Bazaar Specials</span>
        <h3 className="display">fresh finds,<br />pure quality</h3>
        <p>Artisanal crafts and delicacies from weekend markets.</p>
        <button className="btn btn-primary">Shop Now →</button>
      </div>
    </section>
  );
}
