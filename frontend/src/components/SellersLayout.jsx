import { useState, useCallback, useEffect } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { FiBarChart2, FiPackage, FiShoppingBag, FiMenu, FiX, FiArrowLeft, FiLogOut, FiStar, FiMoon, FiSun } from 'react-icons/fi';
import Toast from './Toast';
import SellerDashboard from '../customer-pages/SellerDashboard';
import SellerProducts from '../customer-pages/SellerProducts';
import SellerOrders from '../customer-pages/SellerOrders';
import SellerLogin from '../customer-pages/SellerLogin';
import './SellersLayout.css';

const navLinks = [
  { name: 'Dashboard', path: '/sellers', icon: <FiBarChart2 /> },
  { name: 'Products', path: '/sellers/products', icon: <FiPackage /> },
  { name: 'Orders', path: '/sellers/orders', icon: <FiShoppingBag /> },
];

export default function SellersLayout() {
  const [toast, setToast] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [seller, setSeller] = useState(null);
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  const location = useLocation();
  const notify = useCallback((msg) => setToast(msg), []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('hapn-dark', dark ? '1' : '0');
  }, [dark]);

  useEffect(() => {
    const saved = localStorage.getItem('hapn-dark');
    if (saved === '1') setDark(true);
  }, []);

  const handleLogin = (sellerData) => {
    setSeller(sellerData);
    notify(`Welcome, ${sellerData.shopName}!`);
  };

  const handleLogout = () => {
    const name = seller?.shopName;
    setSeller(null);
    notify(`Logged out. See you, ${name}!`);
  };

  if (!seller) {
    return (
      <>
        <SellerLogin onLogin={handleLogin} />
        <Toast message={toast} onClose={() => setToast('')} />
      </>
    );
  }

  return (
    <div className="sellers-app">
      <header className="sellers-navbar">
        <div className="sellers-navbar-inner">
          <div className="sellers-navbar-left">
            <Link to="/" className="sellers-back-link"><FiArrowLeft /> Back to Store</Link>
            <span className="sellers-navbar-divider" />
            <Link to="/sellers" className="sellers-brand" onClick={() => window.scrollTo({ top: 0 })}>
              <span className="sellers-brand-logo">🏪</span>
              <span className="sellers-brand-name">hap'n! <span className="sellers-brand-accent">Sellers</span></span>
            </Link>
          </div>

          <nav className={`sellers-nav-links ${menuOpen ? 'open' : ''}`}>
            {navLinks.map(link => (
              <Link
                key={link.name}
                to={link.path}
                className={`sellers-nav-link${
                  link.path === '/sellers'
                    ? location.pathname === '/sellers' ? ' active' : ''
                    : location.pathname.startsWith(link.path) ? ' active' : ''
                }`}
                onClick={() => { setMenuOpen(false); window.scrollTo({ top: 0 }); }}
              >
                {link.icon} {link.name}
              </Link>
            ))}
          </nav>

          <div className="sellers-navbar-right">
            <button className="seller-dark-toggle" aria-label="Toggle dark mode" onClick={() => setDark(!dark)} title={dark ? 'Light mode' : 'Dark mode'}>
              {dark ? <FiSun /> : <FiMoon />}
            </button>
            <div className="seller-profile-badge">
              <span className="seller-profile-avatar">{seller.avatar}</span>
              <div className="seller-profile-info">
                <span className="seller-profile-name">{seller.shopName}</span>
                <span className="seller-profile-meta"><FiStar /> {seller.rating} · {seller.sales} sales</span>
              </div>
            </div>
            <button className="seller-logout-btn" onClick={handleLogout} title="Log out">
              <FiLogOut />
            </button>
          </div>

          <button className="sellers-mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </header>

      <main className="sellers-main">
        <Routes>
          <Route index element={<SellerDashboard notify={notify} seller={seller} />} />
          <Route path="products" element={<SellerProducts notify={notify} seller={seller} />} />
          <Route path="orders" element={<SellerOrders notify={notify} seller={seller} />} />
        </Routes>
      </main>

      <footer className="sellers-footer">
        <div className="sellers-footer-inner">
          <span>&copy; 2026 hap'n! Sellers &mdash; Davao City</span>
          <Link to="/">Back to hap'n! Store</Link>
        </div>
      </footer>

      <Toast message={toast} onClose={() => setToast('')} />
    </div>
  );
}
