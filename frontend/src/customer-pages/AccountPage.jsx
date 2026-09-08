import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiPackage, FiHeart, FiMapPin, FiCreditCard, FiSettings, FiLogOut } from 'react-icons/fi';
import '../components/PageLayout.css';
import './AccountPage.css';

const orderHistory = [
  { id: 'ORD-20260301', date: 'Mar 1, 2026', items: 3, total: 1250, status: 'Delivered' },
  { id: 'ORD-20260225', date: 'Feb 25, 2026', items: 1, total: 450, status: 'Delivered' },
  { id: 'ORD-20260218', date: 'Feb 18, 2026', items: 5, total: 2180, status: 'Delivered' },
  { id: 'ORD-20260305', date: 'Mar 5, 2026', items: 2, total: 680, status: 'In Transit' },
];

const addresses = [
  { id: 1, label: 'Home', address: '123 Tulip St., Poblacion, Davao City 8000', isDefault: true },
  { id: 2, label: 'Office', address: '4F Tower A, Abreeza Corp Center, J.P. Laurel Ave., Davao City 8000', isDefault: false },
];

export default function AccountPage({ notify, user, onLogout }) {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { key: 'profile', label: 'Profile', icon: <FiUser /> },
    { key: 'orders', label: 'My Orders', icon: <FiPackage /> },
    { key: 'addresses', label: 'Addresses', icon: <FiMapPin /> },
    { key: 'payment', label: 'Payment', icon: <FiCreditCard /> },
    { key: 'settings', label: 'Settings', icon: <FiSettings /> },
  ];

  return (
    <div className="page-layout">
      <div className="page-hero" style={{ background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)', color: 'var(--gray-900)' }}>
        <h1>My Account</h1>
        <p>Manage your profile, orders, addresses, and preferences all in one place.</p>
        <span className="page-hero-emoji">👤</span>
      </div>

      <div className="account-layout">
        <aside className="account-sidebar">
          <div className="account-avatar">
            <span>👤</span>
            <div>
              <strong>{user.firstName} {user.lastName}</strong>
              <small>{user.email}</small>
            </div>
          </div>
          <nav className="account-nav">
            {tabs.map(tab => (
              <button
                key={tab.key}
                className={`account-nav-btn${activeTab === tab.key ? ' active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
            <button className="account-nav-btn logout" onClick={onLogout}>
              <FiLogOut /> Log Out
            </button>
          </nav>
          <div className="account-sidebar-links">
            <Link to="/wishlist" onClick={() => window.scrollTo({ top: 0 })}>
              <FiHeart /> My Wishlist
            </Link>
          </div>
        </aside>

        <div className="account-content">
          {activeTab === 'profile' && (
            <div className="account-panel">
              <h2>Personal Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" defaultValue={user.firstName} />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" defaultValue={user.lastName} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" defaultValue={user.email} />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="tel" defaultValue={user.phone} />
                </div>
              </div>
              <button className="account-save-btn" onClick={() => notify('Profile updated!')}>Save Changes</button>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="account-panel">
              <h2>Order History</h2>
              <div className="orders-list">
                {orderHistory.map(order => (
                  <div key={order.id} className="order-row" onClick={() => notify(`Viewing order ${order.id}`)}>
                    <div className="order-info">
                      <strong>{order.id}</strong>
                      <span>{order.date}</span>
                    </div>
                    <div className="order-detail">
                      <span>{order.items} item{order.items > 1 ? 's' : ''}</span>
                      <strong>₱{order.total.toLocaleString()}</strong>
                    </div>
                    <span className={`order-status ${order.status.toLowerCase().replace(/\s/g, '-')}`}>
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="account-panel">
              <h2>Saved Addresses</h2>
              <div className="addresses-list">
                {addresses.map(addr => (
                  <div key={addr.id} className="address-card">
                    <div>
                      <strong>{addr.label}</strong>
                      {addr.isDefault && <span className="default-badge">Default</span>}
                      <p>{addr.address}</p>
                    </div>
                    <div className="address-actions">
                      <button onClick={() => notify(`Editing ${addr.label} address...`)}>Edit</button>
                      {!addr.isDefault && <button onClick={() => notify(`Set as default address`)}>Set Default</button>}
                    </div>
                  </div>
                ))}
              </div>
              <button className="account-save-btn" style={{ marginTop: 16 }} onClick={() => notify('Adding new address...')}>+ Add New Address</button>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="account-panel">
              <h2>Payment Methods</h2>
              <div className="payment-list">
                <div className="payment-card">
                  <span className="payment-icon">💳</span>
                  <div>
                    <strong>GCash</strong>
                    <p>+63 912 *** 6789</p>
                  </div>
                  <span className="default-badge">Default</span>
                </div>
                <div className="payment-card">
                  <span className="payment-icon">🏦</span>
                  <div>
                    <strong>Bank Transfer</strong>
                    <p>BDO ****4521</p>
                  </div>
                  <button className="set-default-btn" onClick={() => notify('Set as default payment')}>Set Default</button>
                </div>
                <div className="payment-card">
                  <span className="payment-icon">📱</span>
                  <div>
                    <strong>Maya</strong>
                    <p>+63 917 *** 1234</p>
                  </div>
                  <button className="set-default-btn" onClick={() => notify('Set as default payment')}>Set Default</button>
                </div>
              </div>
              <button className="account-save-btn" style={{ marginTop: 16 }} onClick={() => notify('Adding new payment method...')}>+ Add Payment Method</button>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="account-panel">
              <h2>Preferences</h2>
              <div className="settings-list">
                <label className="setting-row">
                  <div>
                    <strong>Email Notifications</strong>
                    <p>Receive updates on orders, deals, and events</p>
                  </div>
                  <input type="checkbox" defaultChecked onChange={() => notify('Preference updated!')} />
                </label>
                <label className="setting-row">
                  <div>
                    <strong>SMS Alerts</strong>
                    <p>Get text messages for order status updates</p>
                  </div>
                  <input type="checkbox" defaultChecked onChange={() => notify('Preference updated!')} />
                </label>
                <label className="setting-row">
                  <div>
                    <strong>Event Reminders</strong>
                    <p>Notify me about upcoming bazaars and events</p>
                  </div>
                  <input type="checkbox" onChange={() => notify('Preference updated!')} />
                </label>
              </div>
              <h2 style={{ marginTop: 32 }}>Danger Zone</h2>
              <button className="danger-btn" onClick={() => notify('Account deletion requires confirmation via email')}>Delete Account</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
