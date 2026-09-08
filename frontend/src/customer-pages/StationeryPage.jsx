import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import '../components/PageLayout.css';

const products = [
  { id: 301, name: 'Artisan Notebook', price: 250, original_price: 320, merchant_name: 'Papel Co.', category: { name: 'Stationery' } },
  { id: 302, name: 'Calligraphy Pen Set', price: 310, original_price: 450, merchant_name: 'Papel Co.', category: { name: 'Stationery' } },
  { id: 303, name: 'Recycled Paper Journal', price: 180, original_price: 240, merchant_name: 'Green Press', category: { name: 'Stationery' } },
  { id: 304, name: 'Washi Tape Collection', price: 145, original_price: 190, merchant_name: 'TapeWorks DVO', category: { name: 'Stationery' } },
  { id: 305, name: 'Watercolor Postcard Set', price: 95, original_price: 130, merchant_name: 'Art Davao', category: { name: 'Stationery' } },
  { id: 306, name: 'Planner 2026 Edition', price: 420, original_price: 550, merchant_name: 'Papel Co.', category: { name: 'Stationery' } },
  { id: 307, name: 'Bamboo Pen Holder', price: 175, original_price: 220, merchant_name: 'Eco Desk', category: { name: 'Stationery' } },
  { id: 308, name: 'Leather Pencil Pouch', price: 280, original_price: 360, merchant_name: 'Stitch Davao', category: { name: 'Stationery' } },
];

const filters = ['All', 'Notebooks', 'Pens & Tools', 'Art Supplies', 'Planners'];

export default function StationeryPage({ addToCart, toggleWishlist, wishlist, notify }) {
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
      <div className="page-hero" style={{ background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)', color: 'var(--gray-900)' }}>
        <h1>Stationery</h1>
        <p>Beautiful handmade notebooks, pens, planners, and art supplies from local paper crafters.</p>
        <span className="page-hero-emoji">📝</span>
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
          <h3>🖊️ Free custom engraving on pen sets over ₱400</h3>
          <p>Make it personal — add names, initials, or a short message.</p>
        </div>
        <button className="promo-strip-btn" onClick={() => notify('Engraving option added!')}>Customize Now</button>
      </div>

      <div className="page-products-grid">
        {sorted.map(product => (
          <ProductCard key={product.id} product={product} addToCart={addToCart} toggleWishlist={toggleWishlist} isWishlisted={wishlist.some(w => w.id === product.id)} />
        ))}
      </div>

      <div className="page-feature-grid">
        <div className="feature-card" onClick={() => notify('Viewing bulk order options...')}>
          <div className="feature-card-emoji">📚</div>
          <h3>Bulk Orders</h3>
          <p>Order in bulk for events, teams, or giveaways with special pricing.</p>
        </div>
        <div className="feature-card" onClick={() => notify('Exploring eco-friendly collection...')}>
          <div className="feature-card-emoji">🌿</div>
          <h3>Eco-Friendly Line</h3>
          <p>100% recycled and sustainable materials. Good for you, good for earth.</p>
        </div>
        <div className="feature-card" onClick={() => notify('Viewing workshop schedule...')}>
          <div className="feature-card-emoji">✍️</div>
          <h3>Calligraphy Workshops</h3>
          <p>Join weekend workshops and learn the art of beautiful writing.</p>
        </div>
      </div>
    </div>
  );
}
