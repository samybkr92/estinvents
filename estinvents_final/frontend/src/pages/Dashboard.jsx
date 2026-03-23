import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { formatDate, formatDateTime, formatRelative } from '../utils/helpers';
import EventCard from '../components/EventCard';
import NewsCard from '../components/NewsCard';
import { LoadingPage } from '../components/Loader';
import Modal from '../components/Modal';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData]   = useState({ events: [], news: [], professors: [], featured: [] });
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get('/events/featured'),
      api.get('/events?upcoming=true&limit=6'),
      api.get('/news?limit=4'),
      api.get('/professors?limit=6'),
    ]).then(([feat, events, news, profs]) => {
      setData({
        featured:   feat.data.events,
        events:     events.data.events,
        news:       news.data.news,
        professors: profs.data.professors,
      });
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingPage />;

  const hero = data.featured[0] || data.events[0];
  const presentCount = data.professors.filter(p => p.status === 'present').length;
  const absentCount  = data.professors.filter(p => p.status === 'absent').length;

  return (
    <div className="page">
      {/* Greeting */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:28, fontWeight:800, marginBottom:4 }}>
          Hey, {user?.firstName} 👋
        </h1>
        <p style={{ color:'var(--text-secondary)', fontSize:15 }}>
          Here's what's happening at ESTIN today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom:32 }}>
        {[
          { icon:'📅', label:'Upcoming Events', value:data.events.length, bg:'rgba(0,200,150,0.1)', color:'#00C896' },
          { icon:'📰', label:'Latest News',      value:data.news.length,   bg:'rgba(80,130,255,0.1)', color:'#5082ff' },
          { icon:'✅', label:'Profs Present',    value:presentCount,         bg:'rgba(0,200,150,0.1)', color:'#00C896' },
          { icon:'❌', label:'Profs Absent',     value:absentCount,          bg:'rgba(255,75,75,0.1)', color:'#ff4b4b' },
        ].map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-icon" style={{ background: s.bg }}>
              <span>{s.icon}</span>
            </div>
            <div className="stat-info">
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Featured Event Hero */}
      {hero && (
        <div className="featured-banner" onClick={() => setSelected(hero)} style={{ cursor:'pointer' }}>
          <div>
            <div className="featured-tag">⭐ Featured Event</div>
            <h2 className="featured-title">{hero.title}</h2>
            <div className="featured-meta">
              <div className="featured-meta-item">📅 {formatDate(hero.date)}</div>
              <div className="featured-meta-item">📍 {hero.location}</div>
              <div className="featured-meta-item">👤 {hero.organizer}</div>
            </div>
            <button
              className="btn btn-primary"
              style={{ marginTop:18 }}
              onClick={e => { e.stopPropagation(); setSelected(hero); }}
            >
              View Details →
            </button>
          </div>
          <div style={{ textAlign:'right', flexShrink:0, display:'flex', flexDirection:'column', gap:8 }}>
            <span className={`badge cat-${hero.category}`} style={{ fontSize:13, padding:'6px 14px' }}>
              {hero.category}
            </span>
            {hero.capacity && (
              <span style={{ fontSize:13, color:'rgba(255,255,255,0.5)' }}>
                🎟️ {hero.capacity - hero.registeredCount} spots left
              </span>
            )}
          </div>
        </div>
      )}

      {/* Upcoming Events */}
      <div style={{ marginBottom:32 }}>
        <div className="flex-between mb-16">
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:800 }}>
            Upcoming Events
          </h2>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/events')}>
            View all →
          </button>
        </div>
        {data.events.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <div className="empty-title">No upcoming events</div>
          </div>
        ) : (
          <div className="grid-3">
            {data.events.slice(0, 3).map(ev => (
              <EventCard key={ev._id} event={ev} onClick={setSelected} />
            ))}
          </div>
        )}
      </div>

      {/* Latest News */}
      <div style={{ marginBottom:32 }}>
        <div className="flex-between mb-16">
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:800 }}>
            Latest News
          </h2>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/news')}>
            View all →
          </button>
        </div>
        <div className="grid-2">
          {data.news.map(article => (
            <NewsCard key={article._id} article={article} />
          ))}
        </div>
      </div>

      {/* Professors Status */}
      <div>
        <div className="flex-between mb-16">
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:800 }}>
            Professor Status
          </h2>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/professors')}>
            View all →
          </button>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {data.professors.slice(0,4).map(p => (
            <div key={p._id} className="prof-card">
              <div className="prof-avatar">
                {(p.name || '').split(' ').slice(0,2).map(n => n[0] || '').join('').toUpperCase()}
              </div>
              <div className="prof-info">
                <div className="prof-name">{p.name}</div>
                <div className="prof-dept">{p.department}</div>
              </div>
              <div className="prof-status">
                <span className={`status-dot status-${p.status}`} />
                <span className={`badge badge-${p.status === 'present' ? 'green' : p.status === 'absent' ? 'red' : 'gray'}`}>
                  {p.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Event Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.title} size="lg">
        {selected && (
          <div>
            <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:20 }}>
              <span className={`badge cat-${selected.category}`}>{selected.category}</span>
              {selected.isFeatured && <span className="badge badge-orange">⭐ Featured</span>}
            </div>
            <p style={{ color:'var(--text-secondary)', lineHeight:1.7, marginBottom:20 }}>
              {selected.description}
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              {[
                { icon:'📅', label:'Date', val: formatDateTime(selected.date) },
                { icon:'📍', label:'Location', val: selected.location },
                { icon:'👤', label:'Organizer', val: selected.organizer },
                { icon:'🎟️', label:'Capacity', val: selected.capacity ? `${selected.registeredCount}/${selected.capacity} registered` : 'Unlimited' },
              ].map(row => (
                <div key={row.label} style={{ background:'var(--bg-input)', padding:'12px 16px', borderRadius:'var(--radius-sm)' }}>
                  <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:3 }}>{row.icon} {row.label}</div>
                  <div style={{ fontSize:14, fontWeight:600 }}>{row.val}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
