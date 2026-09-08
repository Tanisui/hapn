import { useState, useCallback, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiNavigation, FiMap, FiUsers, FiMenu, FiX, FiArrowLeft, FiLogOut, FiStar, FiMoon, FiSun } from 'react-icons/fi';
import Toast from './Toast';
import RidersPage from '../customer-pages/RidersPage';
import RiderLogin from '../customer-pages/RiderLogin';
import './RidersLayout.css';

const navLinks = [
  { name: 'Dashboard', path: '/riders', icon: <FiNavigation /> },
  { name: 'Live Map', path: '/riders/map', icon: <FiMap /> },
  { name: 'All Riders', path: '/riders/list', icon: <FiUsers /> },
];

export default function RidersLayout() {
  const [toast, setToast] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [rider, setRider] = useState(null);
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

  const handleLogin = (riderData) => {
    setRider(riderData);
    notify(`Welcome, ${riderData.name}!`);
  };

  const handleLogout = () => {
    const name = rider?.name;
    setRider(null);
    notify(`Logged out. See you, ${name}!`);
  };

  // Not logged in → show login page
  if (!rider) {
    return (
      <>
        <RiderLogin onLogin={handleLogin} />
        <Toast message={toast} onClose={() => setToast('')} />
      </>
    );
  }

  return (
    <div className="riders-app">
      <header className="riders-navbar">
        <div className="riders-navbar-inner">
          <div className="riders-navbar-left">
            <Link to="/" className="riders-back-link"><FiArrowLeft /> Back to Store</Link>
            <span className="riders-navbar-divider" />
            <Link to="/riders" className="riders-brand" onClick={() => window.scrollTo({ top: 0 })}>
              <span className="riders-brand-logo">🏍️</span>
              <span className="riders-brand-name">hap'n! <span className="riders-brand-accent">Riders</span></span>
            </Link>
          </div>

          <nav className={`riders-nav-links ${menuOpen ? 'open' : ''}`}>
            {navLinks.map(link => (
              <Link
                key={link.name}
                to={link.path}
                className={`riders-nav-link${location.pathname === link.path ? ' active' : ''}`}
                onClick={() => { setMenuOpen(false); window.scrollTo({ top: 0 }); }}
              >
                {link.icon} {link.name}
              </Link>
            ))}
          </nav>

          <div className="riders-navbar-right">
            <button className="rider-dark-toggle" aria-label="Toggle dark mode" onClick={() => setDark(!dark)} title={dark ? 'Light mode' : 'Dark mode'}>
              {dark ? <FiSun /> : <FiMoon />}
            </button>
            <div className="rider-profile-badge">
              <span className="rider-profile-avatar">{rider.avatar}</span>
              <div className="rider-profile-info">
                <span className="rider-profile-name">{rider.name}</span>
                <span className="rider-profile-meta"><FiStar /> {rider.rating} · {rider.trips} trips</span>
              </div>
            </div>
            <button className="rider-logout-btn" onClick={handleLogout} title="Log out">
              <FiLogOut />
            </button>
          </div>

          <button className="riders-mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </header>

      <main className="riders-main">
        <RidersPage notify={notify} />
      </main>

      <footer className="riders-footer">
        <div className="riders-footer-inner">
          <span>© 2026 hap'n! Riders — Davao City</span>
          <Link to="/">Back to hap'n! Store</Link>
        </div>
      </footer>

      <Toast message={toast} onClose={() => setToast('')} />
    </div>
  );
}
