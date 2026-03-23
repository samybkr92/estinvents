import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getInitials } from '../utils/helpers';

const navItems = [
  { to: '/',          icon: '⬛', label: 'Dashboard' },
  { to: '/events',    icon: '📅', label: 'Events' },
  { to: '/news',      icon: '📰', label: 'News' },
  { to: '/professors',icon: '👨‍🏫', label: 'Professors' },
];

const adminItems = [
  { to: '/admin/events',     icon: '✏️',  label: 'Manage Events' },
  { to: '/admin/news',       icon: '📝',  label: 'Manage News' },
  { to: '/admin/professors', icon: '🎓',  label: 'Manage Profs' },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      <div className={`sidebar-overlay ${open ? 'open' : ''}`} onClick={onClose} />

      <aside className={`sidebar ${open ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-mark">E</div>
          <div className="logo-text">ESTIN<span>VENTS</span></div>
        </div>

        {/* Main Nav */}
        <div className="sidebar-section">
          <div className="sidebar-section-label">Menu</div>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              onClick={onClose}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Admin Nav */}
        {user?.role === 'admin' && (
          <div className="sidebar-section">
            <div className="sidebar-section-label">Admin</div>
            {adminItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                onClick={onClose}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>
        )}

        {/* Bottom: theme + user */}
        <div className="sidebar-bottom">
          {/* Theme toggle */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'6px 12px 12px' }}>
            <span style={{ fontSize:'13px', color:'var(--text-secondary)', fontWeight:500 }}>
              {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
            </span>
            <div className="theme-toggle" onClick={toggle} title="Toggle theme">
              <div className="theme-toggle-thumb">{theme === 'dark' ? '🌙' : '☀️'}</div>
            </div>
          </div>

          {/* User card */}
          {user && (
            <div className="user-card" onClick={handleLogout} title="Click to logout">
              <div className="avatar">{getInitials(user.firstName, user.lastName)}</div>
              <div className="user-info">
                <div className="user-name">{user.firstName} {user.lastName}</div>
                <div className="user-role">{user.role === 'admin' ? '⚡ Admin' : `Year ${user.year || '—'} • ${user.department || 'Student'}`}</div>
              </div>
              <span style={{ fontSize:'14px', color:'var(--text-muted)' }}>↪</span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
