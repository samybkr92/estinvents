import { useState, useEffect } from 'react';
import api from '../utils/api';
import EventCard from '../components/EventCard';
import { LoadingPage } from '../components/Loader';
import Modal from '../components/Modal';
import { formatDateTime, categoryLabels } from '../utils/helpers';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['all', 'academic', 'cultural', 'sports', 'workshop', 'conference', 'club', 'other'];

export default function EventsPage() {
  const [events, setEvents]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [cat, setCat]           = useState('all');
  const [search, setSearch]     = useState('');
  const [upcoming, setUpcoming] = useState(false);
  const [selected, setSelected] = useState(null);
  const [registering, setRegistering] = useState(false);
  const { user } = useAuth();
  const toast = useToast();

  const fetchEvents = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (cat !== 'all') params.set('category', cat);
    if (upcoming) params.set('upcoming', 'true');
    if (search) params.set('search', search);
    api.get(`/events?${params}`)
      .then(res => setEvents(res.data.events))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchEvents(); }, [cat, upcoming, search]);

  const handleRegister = async (eventId) => {
    setRegistering(true);
    try {
      await api.post(`/events/${eventId}/register`);
      toast.success('Registered successfully! 🎉');
      // Refresh selected event
      const res = await api.get(`/events/${eventId}`);
      setSelected(res.data.event);
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  const isRegistered = (event) => event.registeredUsers?.includes(user?._id);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Events</h1>
          <p className="page-subtitle">Discover and register for upcoming campus events</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap', alignItems:'center' }}>
        <div className="search-bar" style={{ flex:'1', minWidth:200 }}>
          <span style={{ color:'var(--text-muted)' }}>🔍</span>
          <input
            placeholder="Search events…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <label style={{ display:'flex', alignItems:'center', gap:8, fontSize:14, cursor:'pointer', color:'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={upcoming}
            onChange={e => setUpcoming(e.target.checked)}
            style={{ accentColor:'var(--accent)', width:15, height:15 }}
          />
          Upcoming only
        </label>
      </div>

      {/* Category chips */}
      <div className="filter-chips">
        {CATEGORIES.map(c => (
          <div
            key={c}
            className={`chip ${cat === c ? 'active' : ''}`}
            onClick={() => setCat(c)}
          >
            {c === 'all' ? 'All' : categoryLabels[c]}
          </div>
        ))}
      </div>

      {/* Events Grid */}
      {loading ? (
        <LoadingPage />
      ) : events.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <div className="empty-title">No events found</div>
          <div className="empty-text">Try adjusting your filters or check back later</div>
        </div>
      ) : (
        <div className="grid-3">
          {events.map(ev => (
            <EventCard key={ev._id} event={ev} onClick={setSelected} />
          ))}
        </div>
      )}

      {/* Event Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.title} size="lg">
        {selected && (
          <div>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:18 }}>
              <span className={`badge cat-${selected.category}`}>{selected.category}</span>
              {selected.isFeatured && <span className="badge badge-orange">⭐ Featured</span>}
            </div>

            <p style={{ color:'var(--text-secondary)', lineHeight:1.7, marginBottom:22 }}>
              {selected.description}
            </p>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:22 }}>
              {[
                { icon:'📅', label:'Start',    val: formatDateTime(selected.date) },
                { icon:'🏁', label:'End',      val: selected.endDate ? formatDateTime(selected.endDate) : '—' },
                { icon:'📍', label:'Location', val: selected.location },
                { icon:'👤', label:'Organizer',val: selected.organizer },
                { icon:'🎟️', label:'Capacity', val: selected.capacity ? `${selected.registeredCount}/${selected.capacity}` : 'Unlimited' },
              ].map(row => (
                <div key={row.label} style={{ background:'var(--bg-input)', padding:'11px 14px', borderRadius:'var(--radius-sm)' }}>
                  <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:2 }}>{row.icon} {row.label}</div>
                  <div style={{ fontSize:14, fontWeight:600 }}>{row.val}</div>
                </div>
              ))}
            </div>

            {selected.tags?.length > 0 && (
              <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:18 }}>
                {selected.tags.map(tag => (
                  <span key={tag} className="badge badge-gray">#{tag}</span>
                ))}
              </div>
            )}

            <div style={{ display:'flex', justifyContent:'flex-end' }}>
              {isRegistered(selected) ? (
                <span className="badge badge-green" style={{ padding:'8px 18px', fontSize:14 }}>
                  ✅ Registered
                </span>
              ) : selected.capacity && selected.registeredCount >= selected.capacity ? (
                <span className="badge badge-red" style={{ padding:'8px 18px', fontSize:14 }}>
                  🚫 Event Full
                </span>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={() => handleRegister(selected._id)}
                  disabled={registering}
                >
                  {registering ? '⏳ Registering…' : '🎟️ Register Now'}
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
