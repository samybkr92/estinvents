import { useTheme } from '../context/ThemeContext';

export default function Topbar({ title, onMenuClick, actions }) {
  const { theme, toggle } = useTheme();

  return (
    <header className="topbar">
      <div style={{ display:'flex', alignItems:'center', gap:14 }}>
        <button className="btn btn-ghost btn-icon menu-btn" onClick={onMenuClick} aria-label="Menu">
          ☰
        </button>
        <h1 className="topbar-title">{title}</h1>
      </div>

      <div className="topbar-actions">
        {actions}
        <button className="btn btn-ghost btn-icon" onClick={toggle} title="Toggle theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
}
