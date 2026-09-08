import './PromoBanners.css';

export default function PromoBanners() {
  return (
    <section className="promo-banners">
      <div className="promo-card promo-left">
        <span className="promo-badge">Up to 20% Off</span>
        <h3>Support Local<br />MSME Products</h3>
        <p>Handpicked items from Davao's finest small businesses.</p>
        <button className="promo-btn">Shop Now →</button>
      </div>
      <div className="promo-card promo-right">
        <span className="promo-badge">Bazaar Specials</span>
        <h3>Fresh Finds,<br />Pure Quality</h3>
        <p>Artisanal crafts and delicacies from weekend markets.</p>
        <button className="promo-btn">Shop Now →</button>
      </div>
    </section>
  );
}
