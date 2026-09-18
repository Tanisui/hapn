import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiSearch, FiUser, FiHeart, FiShoppingCart, FiMenu, FiX } from 'react-icons/fi';
import './Navbar.css';

const categoryLinks = ['Apparel', 'Food & Snacks', 'Stationery', 'Crafts', 'Accessories', 'Home & Living', 'Events'];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="navbar-top">
        <Link to="/shop" className="navbar-brand" aria-label="hap'n! home" onClick={closeMenu}>
          <span className="brand-name">hap'n!</span>
        </Link>

        <div className="navbar-search">
          <span className="search-label">All Categories</span>
          <input
            type="text"
            aria-label="Search"
            placeholder="Search for products, merchants, events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-btn" aria-label="Search">
            <FiSearch />
          </button>
        </div>

        <div className="navbar-actions">
          <button className="action-btn" aria-label="Account"><FiUser /><span>Account</span></button>
          <button className="action-btn" aria-label="Wishlist"><FiHeart /><span>Wishlist</span></button>
          <button className="action-btn cart-btn" aria-label="Cart">
            <FiShoppingCart />
            <span>Cart</span>
            <span className="cart-badge">0</span>
          </button>
        </div>

        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      <nav className={`navbar-categories ${menuOpen ? 'open' : ''}`} aria-label="Main">
        <NavLink to="/shop" end className="nav-link" onClick={closeMenu}>Home</NavLink>
        <NavLink to="/about" className="nav-link" onClick={closeMenu}>About</NavLink>
        {categoryLinks.map((cat) => (
          <a key={cat} href={`#${cat.toLowerCase().replace(/\s+/g, '-')}`} className="nav-link">
            {cat}
          </a>
        ))}
      </nav>
    </header>
  );
}
