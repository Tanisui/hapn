import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiShoppingBag, FiDollarSign, FiStar, FiTrendingUp, FiCheckCircle, FiTruck, FiClock, FiSettings } from 'react-icons/fi';
import './SellerDashboard.css';

const demoProducts = [
  { id: 1, name: 'Hand-Woven Rattan Bag', price: 850, stock: 23, sold: 112, rating: 4.8, image: '🧺', category: 'Crafts', status: 'active' },
  { id: 2, name: 'Dried Mango Pack (500g)', price: 180, stock: 56, sold: 340, rating: 4.9, image: '🥭', category: 'Food', status: 'active' },
  { id: 3, name: 'Davao Durian Candy', price: 120, stock: 0, sold: 205, rating: 4.7, image: '🍬', category: 'Food', status: 'out-of-stock' },
  { id: 4, name: 'Tribal Print Sarong', price: 450, stock: 15, sold: 78, rating: 4.6, image: '🧣', category: 'Apparel', status: 'active' },
  { id: 5, name: 'Coconut Shell Lamp', price: 650, stock: 8, sold: 45, rating: 4.9, image: '🥥', category: 'Home & Living', status: 'active' },
  { id: 6, name: 'Mindanao Coffee Blend', price: 320, stock: 42, sold: 189, rating: 5.0, image: '☕', category: 'Food', status: 'active' },
];

const demoOrders = [
  { id: 'ORD-001', customer: 'Maria Santos', items: 2, total: 1030, status: 'delivered', date: '2026-03-08', product: 'Rattan Bag + Sarong' },
  { id: 'ORD-002', customer: 'Juan Ramos', items: 3, total: 620, status: 'shipping', date: '2026-03-07', product: 'Dried Mango x3' },
  { id: 'ORD-003', customer: 'Teresa Cruz', items: 1, total: 650, status: 'processing', date: '2026-03-07', product: 'Coconut Shell Lamp' },
  { id: 'ORD-004', customer: 'Rico Bautista', items: 5, total: 1600, status: 'delivered', date: '2026-03-06', product: 'Coffee Blend x5' },
  { id: 'ORD-005', customer: 'Ana Reyes', items: 1, total: 850, status: 'delivered', date: '2026-03-05', product: 'Hand-Woven Rattan Bag' },
  { id: 'ORD-006', customer: 'Bea Torres', items: 2, total: 300, status: 'cancelled', date: '2026-03-04', product: 'Durian Candy x2' },
];

const weeklyRevenue = [
  { day: 'Mon', amount: 2400 },
  { day: 'Tue', amount: 1800 },
  { day: 'Wed', amount: 3200 },
  { day: 'Thu', amount: 2900 },
  { day: 'Fri', amount: 4100 },
  { day: 'Sat', amount: 5200 },
  { day: 'Sun', amount: 3600 },
];

export default function SellerDashboard({ notify, seller }) {
  const [products] = useState(demoProducts);

  const stats = useMemo(() => ({
    totalProducts: products.length,
    activeProducts: products.filter(p => p.status === 'active').length,
    totalOrders: demoOrders.length,
    pendingOrders: demoOrders.filter(o => o.status === 'processing' || o.status === 'shipping').length,
    totalRevenue: demoOrders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0),
    avgRating: (products.reduce((s, p) => s + p.rating, 0) / products.length).toFixed(1),
    totalSold: products.reduce((s, p) => s + p.sold, 0),
  }), [products]);

  const maxRevenue = Math.max(...weeklyRevenue.map(d => d.amount));

  const statusIcon = (status) => {
    switch (status) {
      case 'delivered': return <FiCheckCircle className="status-icon delivered" />;
      case 'shipping': return <FiTruck className="status-icon shipping" />;
      case 'processing': return <FiClock className="status-icon processing" />;
      default: return <FiClock className="status-icon cancelled" />;
    }
  };

  return (
    <div className="seller-dashboard">
      {/* Hero */}
      <section className="seller-hero">
        <div className="seller-hero-inner">
          <div className="seller-hero-left">
            <h1>Welcome back, <span>{seller?.shopName || 'Seller'}</span>! 🏪</h1>
            <p>Here's what's happening with your shop today.</p>
          </div>
          <div className="seller-hero-right">
            <span className="seller-hero-avatar">{seller?.avatar || '🏪'}</span>
            <div>
              <div className="seller-hero-shop">{seller?.shopName || 'My Shop'}</div>
              <div className="seller-hero-meta"><FiStar /> {stats.avgRating} · {stats.totalSold} items sold</div>
            </div>
          </div>
        </div>
      </section>

      <div className="seller-content">
        {/* Stats Grid */}
        <div className="seller-stats-grid">
          <Link to="/sellers/products" className="seller-stat-card clickable">
            <div className="stat-icon products"><FiPackage /></div>
            <div className="stat-info">
              <span className="stat-value">{stats.totalProducts}</span>
              <span className="stat-label">Total Products</span>
            </div>
            <span className="stat-badge">{stats.activeProducts} active</span>
          </Link>
          <Link to="/sellers/orders" className="seller-stat-card clickable">
            <div className="stat-icon orders"><FiShoppingBag /></div>
            <div className="stat-info">
              <span className="stat-value">{stats.totalOrders}</span>
              <span className="stat-label">Total Orders</span>
            </div>
            <span className="stat-badge">{stats.pendingOrders} pending</span>
          </Link>
          <div className="seller-stat-card">
            <div className="stat-icon revenue"><FiDollarSign /></div>
            <div className="stat-info">
              <span className="stat-value">₱{stats.totalRevenue.toLocaleString()}</span>
              <span className="stat-label">Total Revenue</span>
            </div>
            <span className="stat-badge trend-up"><FiTrendingUp /> +12%</span>
          </div>
          <div className="seller-stat-card">
            <div className="stat-icon rating"><FiStar /></div>
            <div className="stat-info">
              <span className="stat-value">{stats.avgRating}</span>
              <span className="stat-label">Average Rating</span>
            </div>
            <span className="stat-badge">{stats.totalSold} sold</span>
          </div>
        </div>

        {/* Weekly Revenue Chart */}
        <div className="seller-chart-card">
          <h3><FiTrendingUp /> Weekly Revenue</h3>
          <div className="seller-bar-chart">
            {weeklyRevenue.map(d => (
              <div className="bar-col" key={d.day}>
                <div className="bar-fill" style={{ height: `${(d.amount / maxRevenue) * 100}%` }}>
                  <span className="bar-tooltip">₱{d.amount.toLocaleString()}</span>
                </div>
                <span className="bar-label">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="seller-quick-links">
          <Link to="/sellers/products" className="seller-quick-link">
            <FiPackage /> <span>Manage Products</span> <span className="quick-link-arrow">→</span>
          </Link>
          <Link to="/sellers/orders" className="seller-quick-link">
            <FiShoppingBag /> <span>View Orders</span> <span className="quick-link-arrow">→</span>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="seller-section-card">
          <div className="section-header">
            <h3><FiShoppingBag /> Recent Orders</h3>
            <Link to="/sellers/orders" className="see-all-btn">See All →</Link>
          </div>
          <div className="seller-orders-table">
            <div className="orders-head">
              <span>Order</span><span>Customer</span><span>Product</span><span>Total</span><span>Status</span>
            </div>
            {demoOrders.slice(0, 4).map(o => (
              <div className="orders-row" key={o.id}>
                <span className="order-id">{o.id}</span>
                <span>{o.customer}</span>
                <span className="order-product">{o.product}</span>
                <span className="order-total">₱{o.total.toLocaleString()}</span>
                <span className={`order-status ${o.status}`}>{statusIcon(o.status)} {o.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="seller-section-card">
          <div className="section-header">
            <h3><FiStar /> Top Products</h3>
            <Link to="/sellers/products" className="see-all-btn">View All →</Link>
          </div>
          <div className="seller-top-products">
            {[...products].sort((a, b) => b.sold - a.sold).slice(0, 4).map(p => (
              <div className="top-product-row" key={p.id}>
                <span className="tp-img">{p.image}</span>
                <div className="tp-info">
                  <span className="tp-name">{p.name}</span>
                  <span className="tp-cat">{p.category}</span>
                </div>
                <span className="tp-sold">{p.sold} sold</span>
                <span className="tp-price">₱{p.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Shop Settings shortcut */}
        <div className="seller-section-card settings-shortcut">
          <div className="section-header">
            <h3><FiSettings /> Shop Settings</h3>
          </div>
          <div className="settings-form">
            <div className="settings-row">
              <label>Shop Name</label>
              <input defaultValue={seller?.shopName || 'My Shop'} />
            </div>
            <div className="settings-row">
              <label>Owner Name</label>
              <input defaultValue={seller?.ownerName || ''} />
            </div>
            <div className="settings-row">
              <label>Email</label>
              <input defaultValue={seller?.email || ''} />
            </div>
            <div className="settings-row">
              <label>Phone</label>
              <input defaultValue={seller?.phone || ''} />
            </div>
            <div className="settings-row">
              <label>Category</label>
              <select defaultValue={seller?.category || 'General'}>
                <option>General</option><option>Food & Beverages</option>
                <option>Apparel</option><option>Crafts</option>
                <option>Accessories</option><option>Home & Living</option>
                <option>Stationery</option>
              </select>
            </div>
            <button className="settings-save-btn" onClick={() => notify('✅ Shop settings saved!')}>Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}
