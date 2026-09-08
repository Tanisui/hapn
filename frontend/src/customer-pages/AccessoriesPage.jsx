import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import '../components/PageLayout.css';

const products = [
  { id: 501, name: 'Beaded Bracelet Set', price: 199, original_price: 280, merchant_name: 'Bead & Thread', category: { name: 'Accessories' } },
  { id: 502, name: 'Rattan Earrings', price: 150, original_price: 250, merchant_name: 'Isla Crafts', category: { name: 'Accessories' } },
  { id: 503, name: 'Shell Pendant Necklace', price: 280, original_price: 380, merchant_name: 'Ocean Baubles', category: { name: 'Accessories' } },
  { id: 504, name: 'Woven Leather Belt', price: 350, original_price: 450, merchant_name: 'Leather Lane', category: { name: 'Accessories' } },
  { id: 505, name: 'Brass Cuff Bracelet', price: 420, original_price: 550, merchant_name: 'Metal Muse', category: { name: 'Accessories' } },
  { id: 506, name: 'Hand-painted Hairclip Set', price: 175, original_price: 230, merchant_name: 'Art Davao', category: { name: 'Accessories' } },
  { id: 507, name: 'Coconut Shell Earrings', price: 130, original_price: 180, merchant_name: 'Isla Crafts', category: { name: 'Accessories' } },
  { id: 508, name: 'Beaded Phone Strap', price: 95, original_price: 140, merchant_name: 'Bead & Thread', category: { name: 'Accessories' } },
];

const filters = ['All', 'Earrings', 'Bracelets', 'Necklaces', 'Hair Accessories'];

export default function AccessoriesPage({ addToCart, toggleWishlist, wishlist, notify }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [sort, setSort] = useState('popular');

  const sorted = [...products].sort((a, b) => {
    if (sort === 'low') return a.price - b.price;
    if (sort === 'high') return b.price - a.price;
    if (sort === 'discount') return ((b.original_price - b.price) / b.original_price) - ((a.original_price - a.price) / a.original_price);
    return 0;
  });

  return (
    <div className="page-layout">
      <div className="page-hero" style={{ background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)', color: 'var(--gray-900)' }}>
        <h1>Accessories</h1>
        <p>Handmade jewelry, bags, and accessories — each piece tells a story from Davao's craft community.</p>
        <span className="page-hero-emoji">💍</span>
      </div>

      <div className="page-toolbar">
        <div className="page-toolbar-left">
          {filters.map(f => (
            <button key={f} className={`filter-btn${activeFilter === f ? ' active' : ''}`} onClick={() => { setActiveFilter(f); notify(`Filtering: ${f}`); }}>
              {f}
            </button>
          ))}
          <span className="page-result-count">{products.length} products</span>
        </div>
        <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="popular">Sort by: Popular</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
          <option value="discount">Biggest Discount</option>
        </select>
      </div>

      <div className="page-promo-strip">
        <div>
          <h3>💎 Buy 2 accessories, get 15% off your order</h3>
          <p>Mix and match earrings, bracelets, and necklaces for the perfect set.</p>
        </div>
        <button className="promo-strip-btn" onClick={() => notify('Discount auto-applied at checkout!')}>Shop the Deal</button>
      </div>

      <div className="page-products-grid">
        {sorted.map(product => (
          <ProductCard key={product.id} product={product} addToCart={addToCart} toggleWishlist={toggleWishlist} isWishlisted={wishlist.some(w => w.id === product.id)} />
        ))}
      </div>

      <div className="page-feature-grid">
        <div className="feature-card" onClick={() => notify('Viewing styling guide...')}>
          <div className="feature-card-emoji">💅</div>
          <h3>Styling Guide</h3>
          <p>Tips on how to pair handmade accessories with your everyday outfits.</p>
        </div>
        <div className="feature-card" onClick={() => notify('Viewing care instructions...')}>
          <div className="feature-card-emoji">🧴</div>
          <h3>Jewelry Care</h3>
          <p>Keep your pieces shining. Simple care tips for every material type.</p>
        </div>
        <div className="feature-card" onClick={() => notify('Viewing matching sets...')}>
          <div className="feature-card-emoji">👯</div>
          <h3>Matching Sets</h3>
          <p>Pre-curated earring + necklace + bracelet combos at bundled prices.</p>
        </div>
      </div>
    </div>
  );
}
