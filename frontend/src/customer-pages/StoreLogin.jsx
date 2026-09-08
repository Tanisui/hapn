import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiShoppingBag } from 'react-icons/fi';
import './StoreLogin.css';

// Demo credentials
const STORE_ACCOUNTS = [
  { email: 'juan@hapn.ph', password: 'juan123', firstName: 'Juan', lastName: 'Dela Cruz', phone: '+63 912 345 6789' },
  { email: 'maria@hapn.ph', password: 'maria123', firstName: 'Maria', lastName: 'Santos', phone: '+63 917 654 3210' },
];

export default function StoreLogin({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '',
  });
  const [errors, setErrors] = useState({});

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (isRegister && !form.firstName.trim()) errs.firstName = 'First name is required';
    if (isRegister && !form.lastName.trim()) errs.lastName = 'Last name is required';
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
      const user = {
        id: Date.now(),
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
      };
      onLogin(user);
      return;
    }

    // Login — check credentials
    const account = STORE_ACCOUNTS.find(a => a.email === form.email && a.password === form.password);
    if (account) {
      onLogin({ ...account, id: Date.now() });
    } else {
      setErrors({ email: 'Invalid email or password' });
    }
  };

  return (
    <div className="store-login-page">
      <div className="store-login-container">
        <div className="store-login-card">
          {/* Brand panel */}
          <div className="store-login-brand">
            <div className="store-login-header">
              <span className="store-login-logo"><FiShoppingBag /></span>
              <h1>hap'n!</h1>
              <p>{isRegister ? 'Create your account' : 'Sign in to your account'}</p>
            </div>

            {!isRegister && (
              <div className="store-demo-credentials">
                <p><strong>Demo Accounts:</strong></p>
                <p>📧 <strong>juan@hapn.ph</strong> / <strong>juan123</strong></p>
                <p>📧 <strong>maria@hapn.ph</strong> / <strong>maria123</strong></p>
              </div>
            )}

            <div className="store-login-rider-link">
              <Link to="/riders">🏍️ Login as a Rider</Link>
              <Link to="/sellers">🏪 Login as a Seller</Link>
            </div>
          </div>

          {/* Form panel */}
          <div className="store-login-content">
            <form onSubmit={handleSubmit} className="store-login-form">
              {isRegister && (
                <>
                  <span className="store-section-label">Personal Info</span>
                  <div className="store-form-row">
                    <div className="store-form-group">
                      <label>First Name</label>
                      <input
                        type="text" placeholder="Juan"
                        value={form.firstName}
                        onChange={(e) => update('firstName', e.target.value)}
                        className={errors.firstName ? 'error' : ''}
                      />
                      {errors.firstName && <span className="store-form-error">{errors.firstName}</span>}
                    </div>
                    <div className="store-form-group">
                      <label>Last Name</label>
                      <input
                        type="text" placeholder="Dela Cruz"
                        value={form.lastName}
                        onChange={(e) => update('lastName', e.target.value)}
                        className={errors.lastName ? 'error' : ''}
                      />
                      {errors.lastName && <span className="store-form-error">{errors.lastName}</span>}
                    </div>
                  </div>

                  <div className="store-form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel" placeholder="+63 9XX XXX XXXX"
                      value={form.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      className={errors.phone ? 'error' : ''}
                    />
                    {errors.phone && <span className="store-form-error">{errors.phone}</span>}
                  </div>
                </>
              )}

              <span className="store-section-label">{isRegister ? 'Account Credentials' : 'Credentials'}</span>
              <div className="store-form-group">
                <label>Email</label>
                <div className="store-input-icon">
                  <FiMail />
                  <input
                    type="email" placeholder="you@hapn.ph"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    className={errors.email ? 'error' : ''}
                  />
                </div>
                {errors.email && <span className="store-form-error">{errors.email}</span>}
              </div>

              <div className="store-form-group">
                <label>Password</label>
                <div className="store-input-icon">
                  <FiLock />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => update('password', e.target.value)}
                    className={errors.password ? 'error' : ''}
                  />
                  <button type="button" className="store-toggle-pw" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.password && <span className="store-form-error">{errors.password}</span>}
              </div>

              {!isRegister && (
                <div className="store-form-options">
                  <label className="store-remember-me">
                    <input type="checkbox" /> Remember me
                  </label>
                  <button type="button" className="store-forgot-link" onClick={() => {}}>
                    Forgot password?
                  </button>
                </div>
              )}

              <button type="submit" className="store-login-btn">
                {isRegister ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <div className="store-login-divider"><span>or</span></div>

            <div className="store-login-switch">
              {isRegister ? (
                <p>Already have an account? <button onClick={() => setIsRegister(false)}>Sign In</button></p>
              ) : (
                <p>Don't have an account? <button onClick={() => setIsRegister(true)}>Create one</button></p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
