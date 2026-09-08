import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import '../components/PageLayout.css';

const products = [
  { id: 601, name: 'Coconut Oil Soap', price: 95, original_price: 130, merchant_name: 'Pure Mindanao', category: { name: 'Home & Living' } },
  { id: 602, name: 'Macrame Plant Hanger', price: 275, original_price: 400, merchant_name: 'Knot Studio', category: { name: 'Home & Living' } },
  { id: 603, name: 'Bamboo Utensil Set', price: 320, original_price: 420, merchant_name: 'Eco Home DVO', category: { name: 'Home & Living' } },
  { id: 604, name: 'Scented Soy Candle', price: 180, original_price: 250, merchant_name: 'Wax & Wick', category: { name: 'Home & Living' } },
  { id: 605, name: 'Woven Table Runner', price: 450, original_price: 580, merchant_name: 'Davao Weaves', category: { name: 'Home & Living' } },
  { id: 606, name: 'Ceramic Planter Pot', price: 340, original_price: 420, merchant_name: 'Pottery House', category: { name: 'Home & Living' } },
  { id: 607, name: 'Lemongrass Room Spray', price: 145, original_price: 190, merchant_name: 'Pure Mindanao', category: { name: 'Home & Living' } },
  { id: 608, name: 'Rattan Storage Basket', price: 390, original_price: 500, merchant_name: 'Isla Crafts', category: { name: 'Home & Living' } },
];

const filters = ['All', 'Decor', 'Kitchen', 'Bath & Body', 'Storage'];

export default function HomeLivingPage({ addToCart, toggleWishlist, wishlist, notify }) {
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
      <div className="page-hero" style={{ background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)', color: 'var(--gray-900)' }}>
        <h1>Home & Living</h1>
        <p>Transform your space with locally made decor, kitchenware, and eco-friendly home essentials.</p>
        <span className="page-hero-emoji">🏠</span>
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
          <h3>🏡 Home Starter Bundle — save 20% on 3+ home items</h3>
          <p>Furnish your home with handmade essentials at a bundled discount.</p>
        </div>
        <button className="promo-strip-btn" onClick={() => notify('Bundle deal activated!')}>Build Bundle</button>
      </div>

      <div className="page-products-grid">
        {sorted.map(product => (
          <ProductCard key={product.id} product={product} addToCart={addToCart} toggleWishlist={toggleWishlist} isWishlisted={wishlist.some(w => w.id === product.id)} />
        ))}
      </div>

      <div className="page-feature-grid">
        <div className="feature-card" onClick={() => notify('Viewing room inspiration...')}>
          <div className="feature-card-emoji">🪴</div>
          <h3>Room Inspiration</h3>
          <p>Browse curated looks styled with local homeware for every room type.</p>
        </div>
        <div className="feature-card" onClick={() => notify('Exploring eco-home collection...')}>
          <div className="feature-card-emoji">♻️</div>
          <h3>Eco-Home Collection</h3>
          <p>Sustainable, biodegradable, and zero-waste home products only.</p>
        </div>
        <div className="feature-card" onClick={() => notify('Setting up home scent quiz...')}>
          <div className="feature-card-emoji">🕯️</div>
          <h3>Scent Quiz</h3>
          <p>Find your signature home scent — candles, sprays, and diffusers matched to you.</p>
        </div>
      </div>
    </div>
  );
}
