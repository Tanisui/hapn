import { useState, useMemo } from 'react';
import { FiPackage, FiStar, FiEdit2, FiTrash2, FiPlus, FiEye, FiSearch, FiFilter, FiGrid, FiList } from 'react-icons/fi';
import './SellerProducts.css';

const demoProducts = [
  { id: 1, name: 'Hand-Woven Rattan Bag', price: 850, stock: 23, sold: 112, rating: 4.8, image: '🧺', category: 'Crafts', status: 'active', desc: 'Handcrafted rattan bag from Mindanao artisans.' },
  { id: 2, name: 'Dried Mango Pack (500g)', price: 180, stock: 56, sold: 340, rating: 4.9, image: '🥭', category: 'Food', status: 'active', desc: 'Premium Philippine dried mangoes, naturally sweet.' },
  { id: 3, name: 'Davao Durian Candy', price: 120, stock: 0, sold: 205, rating: 4.7, image: '🍬', category: 'Food', status: 'out-of-stock', desc: 'Authentic durian-flavored candy from Davao City.' },
  { id: 4, name: 'Tribal Print Sarong', price: 450, stock: 15, sold: 78, rating: 4.6, image: '🧣', category: 'Apparel', status: 'active', desc: 'T\'boli-inspired sarong in vibrant tribal prints.' },
  { id: 5, name: 'Coconut Shell Lamp', price: 650, stock: 8, sold: 45, rating: 4.9, image: '🥥', category: 'Home & Living', status: 'active', desc: 'Eco-friendly lamp made from real coconut shells.' },
  { id: 6, name: 'Mindanao Coffee Blend', price: 320, stock: 42, sold: 189, rating: 5.0, image: '☕', category: 'Food', status: 'active', desc: 'Single-origin Arabica from the highlands of Mindanao.' },
  { id: 7, name: 'Abaca Woven Placemat Set', price: 280, stock: 30, sold: 67, rating: 4.5, image: '🍽️', category: 'Home & Living', status: 'active', desc: 'Set of 4 handwoven abaca placemats.' },
  { id: 8, name: 'Pomelo Jam (250ml)', price: 150, stock: 18, sold: 94, rating: 4.8, image: '🍊', category: 'Food', status: 'active', desc: 'Homemade pomelo marmalade, Davao specialty.' },
];

const CATEGORIES = ['All', 'Food', 'Crafts', 'Apparel', 'Home & Living', 'Accessories', 'Stationery'];

export default function SellerProducts({ notify, seller }) {
  const [products, setProducts] = useState(demoProducts);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const filtered = useMemo(() =>
    products
      .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
      .filter(p => catFilter === 'All' || p.category === catFilter)
      .filter(p => statusFilter === 'all' || p.status === statusFilter),
  [products, search, catFilter, statusFilter]);

  const stats = useMemo(() => ({
    total: products.length,
    active: products.filter(p => p.status === 'active').length,
    outOfStock: products.filter(p => p.status === 'out-of-stock').length,
    totalValue: products.reduce((s, p) => s + p.price * p.stock, 0),
  }), [products]);

  const handleDelete = (id) => {
    const p = products.find(x => x.id === id);
    setProducts(prev => prev.filter(x => x.id !== id));
    notify(`Removed "${p.name}" from your shop`);
  };

  return (
    <div className="seller-products-page">
      {/* Page header */}
      <section className="sp-page-header">
        <div className="sp-page-header-inner">
          <div>
            <h1><FiPackage /> My Products</h1>
            <p>Manage your product catalog and inventory</p>
          </div>
          <button className="sp-add-btn" onClick={() => notify('➕ Add Product form coming soon!')}>
            <FiPlus /> Add New Product
          </button>
        </div>
      </section>

      {/* Stats strip */}
      <div className="sp-stats-strip">
        <div className="sp-mini-stat">
          <span className="sp-mini-value">{stats.total}</span>
          <span className="sp-mini-label">Total</span>
        </div>
        <div className="sp-mini-stat active">
          <span className="sp-mini-value">{stats.active}</span>
          <span className="sp-mini-label">Active</span>
        </div>
        <div className="sp-mini-stat oos">
          <span className="sp-mini-value">{stats.outOfStock}</span>
          <span className="sp-mini-label">Out of Stock</span>
        </div>
        <div className="sp-mini-stat value">
          <span className="sp-mini-value">₱{stats.totalValue.toLocaleString()}</span>
          <span className="sp-mini-label">Inventory Value</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="sp-toolbar">
        <div className="sp-search-box">
          <FiSearch />
          <input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="sp-filters">
          <div className="sp-filter-group">
            <FiFilter />
            {CATEGORIES.map(c => (
              <button key={c} className={`sp-filter-btn${catFilter === c ? ' active' : ''}`}
                onClick={() => setCatFilter(c)}>{c}</button>
            ))}
          </div>

          <div className="sp-status-group">
            {['all', 'active', 'out-of-stock'].map(s => (
              <button key={s} className={`sp-status-btn${statusFilter === s ? ' active' : ''}`}
                onClick={() => setStatusFilter(s)}>
                {s === 'all' ? 'All Status' : s === 'active' ? 'Active' : 'Out of Stock'}
              </button>
            ))}
          </div>

          <div className="sp-view-toggle">
            <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')} title="Grid view"><FiGrid /></button>
            <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')} title="List view"><FiList /></button>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className={`sp-products ${viewMode}`}>
        {filtered.map(p => (
          <div className={`sp-card ${p.status} ${viewMode}`} key={p.id}>
            <div className="sp-card-image">{p.image}</div>
            <div className="sp-card-body">
              <div className="sp-card-top">
                <h4>{p.name}</h4>
                <span className={`sp-card-status ${p.status}`}>
                  {p.status === 'active' ? '● Active' : '● Out of Stock'}
                </span>
              </div>
              <span className="sp-card-cat">{p.category}</span>
              <p className="sp-card-desc">{p.desc}</p>
              <div className="sp-card-meta">
                <span className="sp-card-price">₱{p.price.toLocaleString()}</span>
                <span className="sp-card-rating"><FiStar /> {p.rating}</span>
                <span className="sp-card-stock">Stock: <strong>{p.stock}</strong></span>
                <span className="sp-card-sold">{p.sold} sold</span>
              </div>
            </div>
            <div className="sp-card-actions">
              <button className="sp-act-edit" onClick={() => notify(`✏️ Editing "${p.name}"...`)} title="Edit"><FiEdit2 /> {viewMode === 'list' && 'Edit'}</button>
              <button className="sp-act-view" title="View"><FiEye /> {viewMode === 'list' && 'View'}</button>
              <button className="sp-act-delete" onClick={() => handleDelete(p.id)} title="Delete"><FiTrash2 /> {viewMode === 'list' && 'Delete'}</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="sp-empty-state">
            <span className="sp-empty-icon">📦</span>
            <h3>No products found</h3>
            <p>Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  );
}
