import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram } from 'react-icons/fi';
import { company } from '../content/landing';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer on-dark">
      <div className="footer-grid">
        <div className="footer-col">
          <h3 className="footer-brand">hap'n!</h3>
          <p>Bridging MSMEs and consumers in Davao City. Discover local gems, attend events, and support small businesses.</p>
        </div>
        <div className="footer-col">
          <h4>quick links</h4>
          <Link to="/about">About Hap'n</Link>
          <Link to="/shop">Home</Link>
          <a href="#products">Products</a>
          <a href="#events">Events</a>
          <a href="#merchants">Merchants</a>
        </div>
        <div className="footer-col">
          <h4>categories</h4>
          <a href="#">Apparel</a>
          <a href="#">Food & Snacks</a>
          <a href="#">Stationery</a>
          <a href="#">Crafts</a>
        </div>
        <div className="footer-col">
          <h4>follow us</h4>
          <div className="social-links">
            <a href="#" aria-label="Facebook"><FiFacebook /></a>
            <a href="https://www.instagram.com/hapn.co/" target="_blank" rel="noreferrer" aria-label="Instagram">
              <FiInstagram />
            </a>
            <a href="#" aria-label="TikTok">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52V6.8a4.84 4.84 0 01-1-.11z"/></svg>
            </a>
          </div>
          <p className="footer-email"><a href={`mailto:${company.email}`}>{company.email}</a></p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          &copy; 2026 {company.legalName} · SEC Reg. No. {company.secRegNo} · TIN {company.tin}. All rights reserved.
        </p>
        <p>{company.address}</p>
      </div>
    </footer>
  );
}
