import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';

export default function AuthPage() {
  const [mode, setMode]       = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const { login, register }   = useAuth();
  const toast                 = useToast();
  const navigate              = useNavigate();
  const { theme, toggle }     = useTheme();

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', department: '', year: ''
  });

  const set = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
        toast.success('Welcome back! 👋');
      } else {
        await register(form);
        toast.success('Account created! Welcome to ESTINVENTS 🎉');
      }
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Auto-fill email when typing first/last name
  const handleNameChange = (field) => (e) => {
    const val = e.target.value;
    setForm(prev => {
      const updated = { ...prev, [field]: val };
      if (updated.firstName && updated.lastName) {
        const prefix = `${updated.firstName[0].toLowerCase()}_${updated.lastName.toLowerCase()}`;
        updated.email = `${prefix}@estin.dz`;
      }
      return updated;
    });
  };

  return (
    <div className="auth-page">
      {/* Background blobs */}
      <div className="auth-bg-blob" style={{ top: -100, left: -100 }} />
      <div className="auth-bg-blob" style={{ bottom: -100, right: -100 }} />

      {/* Theme toggle top right */}
      <button
        onClick={toggle}
        className="btn btn-ghost btn-icon"
        style={{ position:'fixed', top:20, right:20, zIndex:10 }}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <div className="logo-mark" style={{ width:44, height:44, fontSize:21 }}>E</div>
          <div className="logo-text" style={{ fontSize:24 }}>ESTIN<span>VENTS</span></div>
        </div>

        <h2 className="auth-title">
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h2>
        <p className="auth-subtitle">
          {mode === 'login'
            ? 'Sign in with your ESTIN student account'
            : 'Register with your ESTIN email to get started'}
        </p>

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
                <div className="form-group" style={{ margin:0 }}>
                  <label className="form-label">First Name</label>
                  <input
                    className="form-input"
                    placeholder="Bilal"
                    value={form.firstName}
                    onChange={handleNameChange('firstName')}
                    required
                  />
                </div>
                <div className="form-group" style={{ margin:0 }}>
                  <label className="form-label">Last Name</label>
                  <input
                    className="form-input"
                    placeholder="Boutria"
                    value={form.lastName}
                    onChange={handleNameChange('lastName')}
                    required
                  />
                </div>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
                <div className="form-group" style={{ margin:0 }}>
                  <label className="form-label">Department</label>
                  <select className="form-select" value={form.department} onChange={set('department')}>
                    <option value="">Select…</option>
                    <option>Computer Science</option>
                    <option>Electronics</option>
                    <option>Mathematics</option>
                    <option>Telecommunications</option>
                  </select>
                </div>
                <div className="form-group" style={{ margin:0 }}>
                  <label className="form-label">Year</label>
                  <select className="form-select" value={form.year} onChange={set('year')}>
                    <option value="">Year</option>
                    {[1,2,3,4,5].map(y => <option key={y} value={y}>Year {y}</option>)}
                  </select>
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">ESTIN Email</label>
            <input
              className="form-input"
              type="email"
              placeholder="b_boutria@estin.dz"
              value={form.email}
              onChange={set('email')}
              required
            />
            <div className="email-hint">Format: first_letter_familyname@estin.dz</div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder={mode === 'register' ? 'Min. 6 characters' : '••••••••'}
              value={form.password}
              onChange={set('password')}
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full btn-lg"
            disabled={loading}
            style={{ width:'100%', justifyContent:'center', marginTop:4 }}
          >
            {loading ? '⏳ Please wait…' : (mode === 'login' ? '→ Sign In' : '✨ Create Account')}
          </button>
        </form>

        <div className="auth-switch">
          {mode === 'login' ? (
            <>Don't have an account? <a onClick={() => setMode('register')}>Register</a></>
          ) : (
            <>Already have an account? <a onClick={() => setMode('login')}>Sign In</a></>
          )}
        </div>
      </div>
    </div>
  );
}
