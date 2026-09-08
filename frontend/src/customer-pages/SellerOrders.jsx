import { useState, useMemo } from 'react';
import { FiShoppingBag, FiFilter, FiSearch, FiCheckCircle, FiTruck, FiClock, FiXCircle, FiEye, FiDollarSign, FiPackage, FiCalendar, FiChevronDown } from 'react-icons/fi';
import './SellerOrders.css';

const demoOrders = [
  { id: 'ORD-001', customer: 'Maria Santos', email: 'maria@email.com', items: 2, total: 1030, status: 'delivered', date: '2026-03-08', product: 'Rattan Bag + Sarong', rider: 'Marco Dela Cruz', address: 'Bolton, Davao City' },
  { id: 'ORD-002', customer: 'Juan Ramos', email: 'juan@email.com', items: 3, total: 620, status: 'shipping', date: '2026-03-07', product: 'Dried Mango x3', rider: 'Ana Reyes', address: 'Toril, Davao City' },
  { id: 'ORD-003', customer: 'Teresa Cruz', email: 'teresa@email.com', items: 1, total: 650, status: 'processing', date: '2026-03-07', product: 'Coconut Shell Lamp', rider: null, address: 'Poblacion, Davao City' },
  { id: 'ORD-004', customer: 'Rico Bautista', email: 'rico@email.com', items: 5, total: 1600, status: 'delivered', date: '2026-03-06', product: 'Coffee Blend x5', rider: 'Jenny Lim', address: 'Matina, Davao City' },
  { id: 'ORD-005', customer: 'Ana Reyes', email: 'ana@email.com', items: 1, total: 850, status: 'delivered', date: '2026-03-05', product: 'Hand-Woven Rattan Bag', rider: 'Carlos Mendoza', address: 'Agdao, Davao City' },
  { id: 'ORD-006', customer: 'Bea Torres', email: 'bea@email.com', items: 2, total: 300, status: 'cancelled', date: '2026-03-04', product: 'Durian Candy x2', rider: null, address: 'Buhangin, Davao City' },
  { id: 'ORD-007', customer: 'Carlo Dy', email: 'carlo@email.com', items: 4, total: 1280, status: 'delivered', date: '2026-03-04', product: 'Coffee x2, Placemat x2', rider: 'Bea Torres', address: 'Catalunan, Davao City' },
  { id: 'ORD-008', customer: 'Linda Garcia', email: 'linda@email.com', items: 1, total: 280, status: 'processing', date: '2026-03-08', product: 'Abaca Placemat Set', rider: null, address: 'Sasa, Davao City' },
  { id: 'ORD-009', customer: 'Miguel Santos', email: 'miguel@email.com', items: 2, total: 470, status: 'shipping', date: '2026-03-08', product: 'Sarong + Pomelo Jam', rider: 'Rico Bautista', address: 'Bajada, Davao City' },
  { id: 'ORD-010', customer: 'Sofia Lim', email: 'sofia@email.com', items: 1, total: 150, status: 'delivered', date: '2026-03-03', product: 'Pomelo Jam', rider: 'Marco Dela Cruz', address: 'Ma-a, Davao City' },
];

export default function SellerOrders({ notify, seller }) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [sortBy, setSortBy] = useState('date-desc');

  const stats = useMemo(() => ({
    total: demoOrders.length,
    processing: demoOrders.filter(o => o.status === 'processing').length,
    shipping: demoOrders.filter(o => o.status === 'shipping').length,
    delivered: demoOrders.filter(o => o.status === 'delivered').length,
    cancelled: demoOrders.filter(o => o.status === 'cancelled').length,
    revenue: demoOrders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0),
  }), []);

  const filtered = useMemo(() => {
    let orders = demoOrders
      .filter(o => statusFilter === 'all' || o.status === statusFilter)
      .filter(o =>
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.toLowerCase().includes(search.toLowerCase()) ||
        o.product.toLowerCase().includes(search.toLowerCase())
      );
    if (sortBy === 'date-desc') orders.sort((a, b) => b.date.localeCompare(a.date));
    else if (sortBy === 'date-asc') orders.sort((a, b) => a.date.localeCompare(b.date));
    else if (sortBy === 'total-desc') orders.sort((a, b) => b.total - a.total);
    else if (sortBy === 'total-asc') orders.sort((a, b) => a.total - b.total);
    return orders;
  }, [statusFilter, search, sortBy]);

  const statusIcon = (status) => {
    switch (status) {
      case 'delivered': return <FiCheckCircle />;
      case 'shipping': return <FiTruck />;
      case 'processing': return <FiClock />;
      default: return <FiXCircle />;
    }
  };

  const handleFulfill = (o) => notify(`📦 Fulfilling order ${o.id}...`);
  const handleViewDetails = (o) => {
    setExpanded(expanded === o.id ? null : o.id);
  };

  return (
    <div className="seller-orders-page">
      {/* Header */}
      <section className="so-page-header">
        <div className="so-page-header-inner">
          <div>
            <h1><FiShoppingBag /> Orders</h1>
            <p>Track and manage your customer orders</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="so-stats-row">
        <div className="so-stat" onClick={() => setStatusFilter('all')}>
          <FiShoppingBag className="so-stat-icon all" />
          <div>
            <span className="so-stat-val">{stats.total}</span>
            <span className="so-stat-lbl">Total Orders</span>
          </div>
        </div>
        <div className="so-stat" onClick={() => setStatusFilter('processing')}>
          <FiClock className="so-stat-icon processing" />
          <div>
            <span className="so-stat-val">{stats.processing}</span>
            <span className="so-stat-lbl">Processing</span>
          </div>
        </div>
        <div className="so-stat" onClick={() => setStatusFilter('shipping')}>
          <FiTruck className="so-stat-icon shipping" />
          <div>
            <span className="so-stat-val">{stats.shipping}</span>
            <span className="so-stat-lbl">Shipping</span>
          </div>
        </div>
        <div className="so-stat" onClick={() => setStatusFilter('delivered')}>
          <FiCheckCircle className="so-stat-icon delivered" />
          <div>
            <span className="so-stat-val">{stats.delivered}</span>
            <span className="so-stat-lbl">Delivered</span>
          </div>
        </div>
        <div className="so-stat revenue">
          <FiDollarSign className="so-stat-icon revenue" />
          <div>
            <span className="so-stat-val">₱{stats.revenue.toLocaleString()}</span>
            <span className="so-stat-lbl">Revenue</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="so-toolbar">
        <div className="so-search-box">
          <FiSearch />
          <input placeholder="Search by order ID, customer, or product..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="so-toolbar-right">
          <div className="so-filter-pills">
            <FiFilter />
            {['all', 'processing', 'shipping', 'delivered', 'cancelled'].map(f => (
              <button key={f} className={`so-pill${statusFilter === f ? ' active' : ''}`}
                onClick={() => setStatusFilter(f)}>
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                {f !== 'all' && <span className="so-pill-count">
                  {f === 'processing' ? stats.processing : f === 'shipping' ? stats.shipping : f === 'delivered' ? stats.delivered : stats.cancelled}
                </span>}
              </button>
            ))}
          </div>
          <select className="so-sort" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="total-desc">Highest Amount</option>
            <option value="total-asc">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Orders list */}
      <div className="so-orders-list">
        {filtered.map(o => (
          <div className={`so-order-card ${o.status}${expanded === o.id ? ' expanded' : ''}`} key={o.id}>
            <div className="so-order-main" onClick={() => handleViewDetails(o)}>
              <div className="so-order-left">
                <span className={`so-order-status-badge ${o.status}`}>
                  {statusIcon(o.status)}
                </span>
                <div className="so-order-info">
                  <div className="so-order-id-row">
                    <span className="so-order-id">{o.id}</span>
                    <span className="so-order-date"><FiCalendar /> {o.date}</span>
                  </div>
                  <span className="so-order-customer">{o.customer}</span>
                  <span className="so-order-product">{o.product}</span>
                </div>
              </div>
              <div className="so-order-right">
                <div className="so-order-amount">
                  <span className="so-order-total">₱{o.total.toLocaleString()}</span>
                  <span className="so-order-items">{o.items} item{o.items > 1 ? 's' : ''}</span>
                </div>
                <span className={`so-order-status-tag ${o.status}`}>
                  {statusIcon(o.status)} {o.status}
                </span>
                <FiChevronDown className={`so-expand-icon${expanded === o.id ? ' open' : ''}`} />
              </div>
            </div>

            {expanded === o.id && (
              <div className="so-order-details">
                <div className="so-detail-grid">
                  <div className="so-detail-item">
                    <label>Customer</label>
                    <span>{o.customer}</span>
                  </div>
                  <div className="so-detail-item">
                    <label>Email</label>
                    <span>{o.email}</span>
                  </div>
                  <div className="so-detail-item">
                    <label>Address</label>
                    <span>{o.address}</span>
                  </div>
                  <div className="so-detail-item">
                    <label>Rider</label>
                    <span>{o.rider || 'Not assigned'}</span>
                  </div>
                  <div className="so-detail-item">
                    <label>Products</label>
                    <span>{o.product}</span>
                  </div>
                  <div className="so-detail-item">
                    <label>Status</label>
                    <span className={`so-detail-status ${o.status}`}>{statusIcon(o.status)} {o.status}</span>
                  </div>
                </div>
                <div className="so-detail-actions">
                  {o.status === 'processing' && (
                    <button className="so-action-btn fulfill" onClick={() => handleFulfill(o)}>
                      <FiPackage /> Mark as Shipped
                    </button>
                  )}
                  <button className="so-action-btn view" onClick={() => notify(`🔍 Full details for ${o.id}`)}>
                    <FiEye /> View Full Details
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="so-empty-state">
            <span className="so-empty-icon">📋</span>
            <h3>No orders found</h3>
            <p>Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  );
}
