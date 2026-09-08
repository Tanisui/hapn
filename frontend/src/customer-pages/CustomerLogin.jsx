import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import './CustomerLogin.css';

const CUSTOMER_ACCOUNTS = [
  { email: 'juan@hapn.ph', password: 'juan123', firstName: 'Juan', lastName: 'Dela Cruz', phone: '+63 912 345 6789' },
  { email: 'maria@hapn.ph', password: 'maria123', firstName: 'Maria', lastName: 'Santos', phone: '+63 917 654 3210' },
];

export default function CustomerLogin({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

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
      navigate('/account');
      return;
    }

    const account = CUSTOMER_ACCOUNTS.find(a => a.email === form.email && a.password === form.password);
    if (account) {
      onLogin({ ...account, id: Date.now() });
      navigate('/account');
    } else {
      setErrors({ email: 'Invalid email or password' });
    }
  };

  return (
    <div className="cust-login-page">
      <div className="cust-login-container">
        <Link to="/" className="cust-login-back"><FiArrowLeft /> Back to Store</Link>
        <div className="cust-login-card">
          {/* Brand panel */}
          <div className="cust-login-brand">
            <div className="cust-login-header">
              <span className="cust-login-logo"><FiShoppingBag /></span>
              <h1>hap'n!</h1>
              <p>{isRegister ? 'Create your account' : 'Sign in to your account'}</p>
            </div>

            {!isRegister && (
              <div className="cust-demo-credentials">
                <p><strong>Demo Accounts:</strong></p>
                <p>📧 <strong>juan@hapn.ph</strong> / <strong>juan123</strong></p>
                <p>📧 <strong>maria@hapn.ph</strong> / <strong>maria123</strong></p>
              </div>
            )}

            <div className="cust-login-links">
              <Link to="/riders">🏍️ Login as a Rider</Link>
              <Link to="/sellers">🏪 Login as a Seller</Link>
            </div>
          </div>

          {/* Form panel */}
          <div className="cust-login-content">
            <form onSubmit={handleSubmit} className="cust-login-form">
              {isRegister && (
                <>
                  <span className="cust-section-label">Personal Info</span>
                  <div className="cust-form-row">
                    <div className="cust-form-group">
                      <label>First Name</label>
                      <input
                        type="text" placeholder="Juan"
                        value={form.firstName}
                        onChange={(e) => update('firstName', e.target.value)}
                        className={errors.firstName ? 'error' : ''}
                      />
                      {errors.firstName && <span className="cust-form-error">{errors.firstName}</span>}
                    </div>
                    <div className="cust-form-group">
                      <label>Last Name</label>
                      <input
                        type="text" placeholder="Dela Cruz"
                        value={form.lastName}
                        onChange={(e) => update('lastName', e.target.value)}
                        className={errors.lastName ? 'error' : ''}
                      />
                      {errors.lastName && <span className="cust-form-error">{errors.lastName}</span>}
                    </div>
                  </div>

                  <div className="cust-form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel" placeholder="+63 9XX XXX XXXX"
                      value={form.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      className={errors.phone ? 'error' : ''}
                    />
                    {errors.phone && <span className="cust-form-error">{errors.phone}</span>}
                  </div>
                </>
              )}

              <span className="cust-section-label">{isRegister ? 'Account Credentials' : 'Credentials'}</span>
              <div className="cust-form-group">
                <label>Email</label>
                <div className="cust-input-icon">
                  <FiMail />
                  <input
                    type="email" placeholder="you@hapn.ph"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    className={errors.email ? 'error' : ''}
                  />
                </div>
                {errors.email && <span className="cust-form-error">{errors.email}</span>}
              </div>

              <div className="cust-form-group">
                <label>Password</label>
                <div className="cust-input-icon">
                  <FiLock />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => update('password', e.target.value)}
                    className={errors.password ? 'error' : ''}
                  />
                  <button type="button" className="cust-toggle-pw" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.password && <span className="cust-form-error">{errors.password}</span>}
              </div>

              {!isRegister && (
                <div className="cust-form-options">
                  <label className="cust-remember-me">
                    <input type="checkbox" /> Remember me
                  </label>
                  <button type="button" className="cust-forgot-link" onClick={() => {}}>
                    Forgot password?
                  </button>
                </div>
              )}

              <button type="submit" className="cust-login-btn">
                {isRegister ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <div className="cust-login-divider"><span>or</span></div>

            <div className="cust-login-switch">
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
