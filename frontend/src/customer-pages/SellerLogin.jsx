import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import './SellerLogin.css';

const SELLER_ACCOUNTS = [
  { email: 'seller@hapn.ph', password: 'seller123', shopName: 'Lola\'s Lechon Manok', ownerName: 'Rosa Dela Cruz', phone: '+63 912 111 2222', avatar: '🏪', products: 24, rating: 4.9, sales: 1580 },
  { email: 'craft@hapn.ph', password: 'craft123', shopName: 'Mindanao Crafts Co.', ownerName: 'Ben Torres', phone: '+63 917 333 4444', avatar: '🎨', products: 42, rating: 4.7, sales: 890 },
];

export default function SellerLogin({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    shopName: '', ownerName: '', email: '', phone: '', password: '', category: 'General',
  });
  const [errors, setErrors] = useState({});

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (isRegister && !form.shopName.trim()) errs.shopName = 'Shop name is required';
    if (isRegister && !form.ownerName.trim()) errs.ownerName = 'Owner name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Min 6 characters';
    if (isRegister && !form.phone.trim()) errs.phone = 'Phone is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (isRegister) {
      const seller = {
        id: Date.now(), shopName: form.shopName, ownerName: form.ownerName,
        email: form.email, phone: form.phone, category: form.category,
        avatar: '🏪', products: 0, rating: 0, sales: 0,
      };
      onLogin(seller);
      return;
    }

    const account = SELLER_ACCOUNTS.find(a => a.email === form.email && a.password === form.password);
    if (account) {
      onLogin({ ...account, id: Date.now() });
    } else {
      setErrors({ email: 'Invalid email or password' });
    }
  };

  return (
    <div className="seller-login-page">
      <div className="seller-login-bg"><div className="seller-login-bg-overlay" /></div>
      <div className="seller-login-container">
        <Link to="/" className="seller-login-back"><FiArrowLeft /> Back to Store</Link>
        <div className="seller-login-card">
          {/* Brand panel */}
          <div className="seller-login-brand">
            <div className="seller-login-header">
              <span className="seller-login-logo"><FiShoppingBag /></span>
              <h1>hap'n! <span>Sellers</span></h1>
              <p>{isRegister ? 'Register your MSME shop' : 'Sign in to your seller dashboard'}</p>
            </div>

            {!isRegister && (
              <div className="seller-demo-credentials">
                <p><strong>Demo Accounts:</strong></p>
                <p>📧 <strong>seller@hapn.ph</strong> / <strong>seller123</strong></p>
                <p>📧 <strong>craft@hapn.ph</strong> / <strong>craft123</strong></p>
              </div>
            )}

            <div className="seller-login-links">
              <Link to="/riders">🏍️ Login as a Rider</Link>
              <Link to="/account">🛍️ Login as a Customer</Link>
            </div>
          </div>

          {/* Form panel */}
          <div className="seller-login-content">
            <form onSubmit={handleSubmit} className="seller-login-form">
              {isRegister && (
                <>
                  <span className="seller-section-label">Shop Info</span>
                  <div className="seller-form-row">
                    <div className="seller-form-group">
                      <label>Shop Name</label>
                      <input type="text" placeholder="My MSME Shop" value={form.shopName}
                        onChange={(e) => update('shopName', e.target.value)} className={errors.shopName ? 'error' : ''} />
                      {errors.shopName && <span className="seller-form-error">{errors.shopName}</span>}
                    </div>
                    <div className="seller-form-group">
                      <label>Owner Name</label>
                      <input type="text" placeholder="Juan Dela Cruz" value={form.ownerName}
                        onChange={(e) => update('ownerName', e.target.value)} className={errors.ownerName ? 'error' : ''} />
                      {errors.ownerName && <span className="seller-form-error">{errors.ownerName}</span>}
                    </div>
                  </div>

                  <div className="seller-form-group">
                    <label>Phone Number</label>
                    <input type="tel" placeholder="+63 9XX XXX XXXX" value={form.phone}
                      onChange={(e) => update('phone', e.target.value)} className={errors.phone ? 'error' : ''} />
                    {errors.phone && <span className="seller-form-error">{errors.phone}</span>}
                  </div>

                  <div className="seller-form-group">
                    <label>Shop Category</label>
                    <select value={form.category} onChange={(e) => update('category', e.target.value)}>
                      <option>General</option><option>Food & Snacks</option><option>Apparel</option>
                      <option>Crafts</option><option>Accessories</option><option>Home & Living</option><option>Stationery</option>
                    </select>
                  </div>
                </>
              )}

              <span className="seller-section-label">{isRegister ? 'Account Credentials' : 'Credentials'}</span>
              <div className="seller-form-group">
                <label>Email</label>
                <div className="seller-input-icon">
                  <FiMail />
                  <input type="email" placeholder="shop@hapn.ph" value={form.email}
                    onChange={(e) => update('email', e.target.value)} className={errors.email ? 'error' : ''} />
                </div>
                {errors.email && <span className="seller-form-error">{errors.email}</span>}
              </div>

              <div className="seller-form-group">
                <label>Password</label>
                <div className="seller-input-icon">
                  <FiLock />
                  <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={form.password}
                    onChange={(e) => update('password', e.target.value)} className={errors.password ? 'error' : ''} />
                  <button type="button" className="seller-toggle-pw" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.password && <span className="seller-form-error">{errors.password}</span>}
              </div>

              {!isRegister && (
                <div className="seller-form-options">
                  <label className="seller-remember"><input type="checkbox" /> Remember me</label>
                  <button type="button" className="seller-forgot">Forgot password?</button>
                </div>
              )}

              <button type="submit" className="seller-login-btn">
                {isRegister ? 'Register Shop' : 'Sign In'}
              </button>
            </form>

            <div className="seller-login-divider"><span>or</span></div>

            <div className="seller-login-switch">
              {isRegister
                ? <p>Already registered? <button onClick={() => setIsRegister(false)}>Sign In</button></p>
                : <p>New seller? <button onClick={() => setIsRegister(true)}>Register your Shop</button></p>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
