import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import '../components/PageLayout.css';

const products = [
  { id: 401, name: 'Embroidered Pouch', price: 320, original_price: 400, merchant_name: 'Stitch Davao', category: { name: 'Crafts' } },
  { id: 402, name: 'Macrame Wall Hanging', price: 580, original_price: 750, merchant_name: 'Knot Studio', category: { name: 'Crafts' } },
  { id: 403, name: 'Clay Vase Set', price: 690, original_price: 850, merchant_name: 'Pottery House', category: { name: 'Crafts' } },
  { id: 404, name: 'Resin Art Coasters', price: 350, original_price: 450, merchant_name: 'Resin Davao', category: { name: 'Crafts' } },
  { id: 405, name: 'Wood Carving Frame', price: 420, original_price: 550, merchant_name: 'Timber Craft', category: { name: 'Crafts' } },
  { id: 406, name: 'Crochet Beach Bag', price: 480, original_price: 620, merchant_name: 'Hook & Loop', category: { name: 'Crafts' } },
  { id: 407, name: 'Fabric Art Tray', price: 275, original_price: 350, merchant_name: 'Stitch Davao', category: { name: 'Crafts' } },
  { id: 408, name: 'Painted Canvas Tote', price: 390, original_price: 500, merchant_name: 'Art Davao', category: { name: 'Crafts' } },
];

const filters = ['All', 'Textile', 'Pottery', 'Woodwork', 'Resin Art'];

export default function CraftsPage({ addToCart, toggleWishlist, wishlist, notify }) {
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
      <div className="page-hero" style={{ background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)', color: 'var(--gray-900)' }}>
        <h1>Crafts & Handmade</h1>
        <p>One-of-a-kind handcrafted pieces — pottery, textiles, wood carvings, and resin art from Davao artisans.</p>
        <span className="page-hero-emoji">🎨</span>
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
          <h3>🎨 Meet the Maker — see the artisan behind every piece</h3>
          <p>Each craft includes an artisan story card with photos and their process.</p>
        </div>
        <button className="promo-strip-btn" onClick={() => notify('Viewing artisan stories!')}>Explore Stories</button>
      </div>

      <div className="page-products-grid">
        {sorted.map(product => (
          <ProductCard key={product.id} product={product} addToCart={addToCart} toggleWishlist={toggleWishlist} isWishlisted={wishlist.some(w => w.id === product.id)} />
        ))}
      </div>

      <div className="page-feature-grid">
        <div className="feature-card" onClick={() => notify('Viewing commission options...')}>
          <div className="feature-card-emoji">🖌️</div>
          <h3>Commission a Piece</h3>
          <p>Request a custom artwork or craft tailored to your taste and home.</p>
        </div>
        <div className="feature-card" onClick={() => notify('Exploring craft workshops...')}>
          <div className="feature-card-emoji">🏺</div>
          <h3>Craft Workshops</h3>
          <p>Hands-on pottery, macrame, and resin art classes every weekend.</p>
        </div>
        <div className="feature-card" onClick={() => notify('Viewing gift wrapping options...')}>
          <div className="feature-card-emoji">🎁</div>
          <h3>Gift-Ready Wrapping</h3>
          <p>Premium eco-friendly gift wrapping available for all handmade items.</p>
        </div>
      </div>
    </div>
  );
}
