import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
import './RiderLogin.css';

// Demo credentials
const RIDER_ACCOUNTS = [
  { email: 'rider@hapn.ph', password: 'rider123', name: 'Marco Dela Cruz', phone: '+63 912 345 6789', vehicle: 'Motorcycle', plate: 'MC-1234', avatar: '🧑‍💼', rating: 4.9, trips: 1243 },
  { email: 'ana@hapn.ph', password: 'ana123', name: 'Ana Reyes', phone: '+63 917 654 3210', vehicle: 'Motorcycle', plate: 'AR-5678', avatar: '👩‍💼', rating: 4.8, trips: 987 },
];

export default function RiderLogin({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', vehicle: 'Motorcycle', plate: '',
  });
  const [errors, setErrors] = useState({});

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (isRegister && !form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Min 6 characters';
    if (isRegister && !form.phone.trim()) errs.phone = 'Phone is required';
    if (isRegister && form.vehicle === 'Motorcycle' && !form.plate.trim()) errs.plate = 'Plate number required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (isRegister) {
      // New registration
      const rider = {
        id: Date.now(),
        name: form.name,
        email: form.email,
        phone: form.phone,
        vehicle: form.vehicle,
        plate: form.plate,
        avatar: '🧑‍💼',
        rating: 0,
        trips: 0,
        status: 'available',
      };
      onLogin(rider);
      return;
    }

    // Login — check credentials
    const account = RIDER_ACCOUNTS.find(a => a.email === form.email && a.password === form.password);
    if (account) {
      onLogin({ ...account, id: Date.now(), status: 'available' });
    } else {
      setErrors({ email: 'Invalid email or password' });
    }
  };

  return (
    <div className="rider-login-page">
      <div className="rider-login-bg">
        <div className="rider-login-bg-overlay" />
      </div>

      <div className="rider-login-container">
        <Link to="/" className="rider-login-back"><FiArrowLeft /> Back to Store</Link>

        <div className="rider-login-card">
          {/* Brand panel */}
          <div className="rider-login-brand">
            <div className="rider-login-header">
              <span className="rider-login-logo">🏍️</span>
              <h1>hap'n! <span>Riders</span></h1>
              <p>{isRegister ? 'Create your rider account' : 'Sign in to your rider dashboard'}</p>
            </div>

            {!isRegister && (
              <div className="demo-credentials">
                <p><strong>Demo Accounts:</strong></p>
                <p>📧 <strong>rider@hapn.ph</strong> / <strong>rider123</strong></p>
                <p>📧 <strong>ana@hapn.ph</strong> / <strong>ana123</strong></p>
              </div>
            )}

            <div className="rider-login-store-link">
              <Link to="/account">🛍️ Login as a Customer</Link>
              <Link to="/sellers">🏪 Login as a Seller</Link>
            </div>
          </div>

          {/* Form panel */}
          <div className="rider-login-content">
            <form onSubmit={handleSubmit} className="rider-login-form">
              {isRegister && (
                <>
                  <span className="rider-section-label">Personal Info</span>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      placeholder="Juan Dela Cruz"
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      className={errors.name ? 'error' : ''}
                    />
                    {errors.name && <span className="form-error">{errors.name}</span>}
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+63 9XX XXX XXXX"
                      value={form.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      className={errors.phone ? 'error' : ''}
                    />
                    {errors.phone && <span className="form-error">{errors.phone}</span>}
                  </div>
                </>
              )}

              <span className="rider-section-label">{isRegister ? 'Account Credentials' : 'Credentials'}</span>
              <div className="form-group">
                <label>Email</label>
                <div className="input-icon">
                  <FiMail />
                  <input
                    type="email"
                    placeholder="rider@hapn.ph"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    className={errors.email ? 'error' : ''}
                  />
                </div>
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-icon">
                  <FiLock />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => update('password', e.target.value)}
                    className={errors.password ? 'error' : ''}
                  />
                  <button type="button" className="toggle-pw" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.password && <span className="form-error">{errors.password}</span>}
              </div>

              {isRegister && (
                <>
                  <span className="rider-section-label">Vehicle Details</span>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Vehicle Type</label>
                      <select value={form.vehicle} onChange={(e) => update('vehicle', e.target.value)}>
                        <option value="Motorcycle">Motorcycle</option>
                        <option value="Bicycle">Bicycle</option>
                        <option value="Car">Car</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Plate Number</label>
                      <input
                        type="text"
                        placeholder="XX-1234"
                        value={form.plate}
                        onChange={(e) => update('plate', e.target.value)}
                        className={errors.plate ? 'error' : ''}
                      />
                      {errors.plate && <span className="form-error">{errors.plate}</span>}
                    </div>
                  </div>
                </>
              )}

              {!isRegister && (
                <div className="form-options">
                  <label className="remember-me">
                    <input type="checkbox" /> Remember me
                  </label>
                  <button type="button" className="forgot-link" onClick={() => {}}>
                    Forgot password?
                  </button>
                </div>
              )}

              <button type="submit" className="rider-login-btn">
                {isRegister ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <div className="rider-login-divider"><span>or</span></div>

            <div className="rider-login-switch">
              {isRegister ? (
                <p>Already have an account? <button onClick={() => setIsRegister(false)}>Sign In</button></p>
              ) : (
                <p>New rider? <button onClick={() => setIsRegister(true)}>Create an Account</button></p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
