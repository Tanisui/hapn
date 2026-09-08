import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import '../components/PageLayout.css';

const products = [
  { id: 201, name: 'Dried Mango Pack', price: 180, original_price: 220, merchant_name: 'Tropik Bites', category: { name: 'Food & Snacks' } },
  { id: 202, name: 'Durian Candy Box', price: 120, original_price: 150, merchant_name: 'Davao Delights', category: { name: 'Food & Snacks' } },
  { id: 203, name: 'Banana Chips Jar', price: 85, original_price: 120, merchant_name: 'Chippy South', category: { name: 'Food & Snacks' } },
  { id: 204, name: 'Tablea Hot Chocolate', price: 195, original_price: 250, merchant_name: 'Cacao Culture', category: { name: 'Food & Snacks' } },
  { id: 205, name: 'Pomelo Marmalade', price: 160, original_price: 200, merchant_name: 'Jam Session', category: { name: 'Food & Snacks' } },
  { id: 206, name: 'Ube Pastillas Box', price: 140, original_price: 180, merchant_name: 'Sweet Mindanao', category: { name: 'Food & Snacks' } },
  { id: 207, name: 'Turmeric Tea Blend', price: 220, original_price: 280, merchant_name: 'Herban Brew', category: { name: 'Food & Snacks' } },
  { id: 208, name: 'Coconut Sugar Pack', price: 110, original_price: 150, merchant_name: 'Pure Mindanao', category: { name: 'Food & Snacks' } },
];

const filters = ['All', 'Dried Fruits', 'Sweets', 'Beverages', 'Condiments'];

export default function FoodPage({ addToCart, toggleWishlist, wishlist, notify }) {
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
      <div className="page-hero" style={{ background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)', color: 'var(--gray-900)' }}>
        <h1>Food & Snacks</h1>
        <p>Authentic Davao flavors — dried fruits, sweets, artisanal beverages, and local delicacies.</p>
        <span className="page-hero-emoji">🍜</span>
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
          <h3>🎁 Buy 3, Get 1 Free on all pasalubong packs!</h3>
          <p>Stock up on gifts — perfect for friends and family abroad.</p>
        </div>
        <button className="promo-strip-btn" onClick={() => notify('Bundle deal applied!')}>Grab the Deal</button>
      </div>

      <div className="page-products-grid">
        {sorted.map(product => (
          <ProductCard key={product.id} product={product} addToCart={addToCart} toggleWishlist={toggleWishlist} isWishlisted={wishlist.some(w => w.id === product.id)} />
        ))}
      </div>

      <div className="page-feature-grid">
        <div className="feature-card" onClick={() => notify('Viewing freshness guarantee...')}>
          <div className="feature-card-emoji">✅</div>
          <h3>Freshness Guarantee</h3>
          <p>All products shipped within 48hrs of preparation. Quality assured.</p>
        </div>
        <div className="feature-card" onClick={() => notify('Building gift box...')}>
          <div className="feature-card-emoji">🎀</div>
          <h3>Gift Box Builder</h3>
          <p>Mix and match snacks into a custom pasalubong gift box.</p>
        </div>
        <div className="feature-card" onClick={() => notify('Viewing subscription plans...')}>
          <div className="feature-card-emoji">📦</div>
          <h3>Monthly Snack Box</h3>
          <p>Subscribe for curated Davao snacks delivered to your door every month.</p>
        </div>
      </div>
    </div>
  );
}
