import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import '../components/PageLayout.css';

const products = [
  { id: 101, name: 'Hand-woven Tote Bag', price: 450, original_price: 599, merchant_name: 'Davao Weaves', category: { name: 'Apparel' } },
  { id: 102, name: 'Tie-Dye Shirt', price: 380, original_price: 499, merchant_name: 'Dye Lab DVO', category: { name: 'Apparel' } },
  { id: 103, name: 'Batik Print Dress', price: 720, original_price: 950, merchant_name: 'Isla Threads', category: { name: 'Apparel' } },
  { id: 104, name: 'Embroidered Cap', price: 290, original_price: 350, merchant_name: 'Stitch Davao', category: { name: 'Apparel' } },
  { id: 105, name: 'Tribal Print Scarf', price: 320, original_price: 420, merchant_name: 'Davao Weaves', category: { name: 'Apparel' } },
  { id: 106, name: 'Upcycled Denim Jacket', price: 890, original_price: 1200, merchant_name: 'ReThread Co.', category: { name: 'Apparel' } },
  { id: 107, name: 'Bamboo Fiber Socks', price: 150, original_price: 200, merchant_name: 'Green Steps', category: { name: 'Apparel' } },
  { id: 108, name: 'Handloom Cotton Polo', price: 550, original_price: 700, merchant_name: 'Isla Threads', category: { name: 'Apparel' } },
];

const filters = ['All', 'Tops', 'Bottoms', 'Dresses', 'Accessories'];

export default function ApparelPage({ addToCart, toggleWishlist, wishlist, notify }) {
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
      <div className="page-hero" style={{ background: 'linear-gradient(135deg, #ffebee 0%, #fce4ec 100%)', color: 'var(--gray-900)' }}>
        <h1>Apparel & Fashion</h1>
        <p>Locally crafted clothing and fashion pieces from Davao's talented designers and weavers.</p>
        <span className="page-hero-emoji">👕</span>
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
          <h3>🧵 Free Alterations on orders over ₱1,000</h3>
          <p>Support local tailors — get free fitting adjustments with your purchase.</p>
        </div>
        <button className="promo-strip-btn" onClick={() => notify('Promo applied at checkout!')}>Learn More</button>
      </div>

      <div className="page-products-grid">
        {sorted.map(product => (
          <ProductCard key={product.id} product={product} addToCart={addToCart} toggleWishlist={toggleWishlist} isWishlisted={wishlist.some(w => w.id === product.id)} />
        ))}
      </div>

      <div className="page-feature-grid">
        <div className="feature-card" onClick={() => notify('Viewing size guide...')}>
          <div className="feature-card-emoji">📏</div>
          <h3>Size Guide</h3>
          <p>Find your perfect fit with our detailed measurement chart.</p>
        </div>
        <div className="feature-card" onClick={() => notify('Viewing fabric care tips...')}>
          <div className="feature-card-emoji">🧺</div>
          <h3>Fabric Care Tips</h3>
          <p>Keep your handmade garments looking fresh and lasting longer.</p>
        </div>
        <div className="feature-card" onClick={() => notify('Viewing custom orders...')}>
          <div className="feature-card-emoji">✂️</div>
          <h3>Custom Orders</h3>
          <p>Request personalized designs directly from local artisans.</p>
        </div>
      </div>
    </div>
  );
}
