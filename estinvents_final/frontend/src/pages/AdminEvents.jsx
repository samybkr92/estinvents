import { useState, useEffect } from 'react';
import api from '../utils/api';
import Modal from '../components/Modal';
import { LoadingPage } from '../components/Loader';
import { useToast } from '../context/ToastContext';
import { formatDate, categoryLabels } from '../utils/helpers';

const EMPTY = {
  title:'', description:'', category:'other', date:'', endDate:'',
  location:'', organizer:'', capacity:'', tags:'', isFeatured:false
};

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]   = useState(null); // null | 'create' | 'edit'
  const [form, setForm]     = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const fetchEvents = () => {
    setLoading(true);
    api.get('/events?limit=50').then(r => setEvents(r.data.events)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchEvents(); }, []);

  const set = (k) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(prev => ({ ...prev, [k]: val }));
  };

  const openCreate = () => { setForm(EMPTY); setModal('create'); };
  const openEdit   = (ev) => {
    setForm({
      ...ev,
      date:    ev.date ? ev.date.slice(0,16) : '',
      endDate: ev.endDate ? ev.endDate.slice(0,16) : '',
      tags:    Array.isArray(ev.tags) ? ev.tags.join(', ') : '',
      capacity: ev.capacity || '',
    });
    setModal('edit');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        capacity: form.capacity ? Number(form.capacity) : null,
      };
      if (modal === 'create') {
        await api.post('/events', payload);
        toast.success('Event created! 🎉');
      } else {
        await api.put(`/events/${form._id}`, payload);
        toast.success('Event updated ✅');
      }
      setModal(null);
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await api.delete(`/events/${id}`);
      toast.success('Event deleted');
      fetchEvents();
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Events</h1>
          <p className="page-subtitle">{events.length} total events</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ New Event</button>
      </div>

      {loading ? <LoadingPage /> : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {events.map(ev => (
            <div key={ev._id} className="card" style={{ display:'flex', alignItems:'center', gap:16, padding:'16px 20px' }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                  <span className={`badge cat-${ev.category}`}>{ev.category}</span>
                  {ev.isFeatured && <span className="badge badge-orange">⭐</span>}
                </div>
                <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:15 }} className="truncate">{ev.title}</div>
                <div style={{ fontSize:13, color:'var(--text-secondary)', marginTop:2 }}>
                  📅 {formatDate(ev.date)} · 📍 {ev.location}
                </div>
              </div>
              <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => openEdit(ev)}>✏️ Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(ev._id)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal === 'create' ? 'Create Event' : 'Edit Event'}
        size="lg"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? '⏳ Saving…' : (modal === 'create' ? '+ Create' : '✅ Save')}
            </button>
          </>
        }
      >
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          <div className="form-group" style={{ gridColumn:'1/-1', margin:0 }}>
            <label className="form-label">Title *</label>
            <input className="form-input" value={form.title} onChange={set('title')} required />
          </div>
          <div className="form-group" style={{ gridColumn:'1/-1', margin:0 }}>
            <label className="form-label">Description *</label>
            <textarea className="form-textarea" value={form.description} onChange={set('description')} rows={3} />
          </div>
          <div className="form-group" style={{ margin:0 }}>
            <label className="form-label">Category</label>
            <select className="form-select" value={form.category} onChange={set('category')}>
              {Object.entries(categoryLabels).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ margin:0 }}>
            <label className="form-label">Organizer *</label>
            <input className="form-input" value={form.organizer} onChange={set('organizer')} />
          </div>
          <div className="form-group" style={{ margin:0 }}>
            <label className="form-label">Start Date *</label>
            <input className="form-input" type="datetime-local" value={form.date} onChange={set('date')} />
          </div>
          <div className="form-group" style={{ margin:0 }}>
            <label className="form-label">End Date</label>
            <input className="form-input" type="datetime-local" value={form.endDate} onChange={set('endDate')} />
          </div>
          <div className="form-group" style={{ margin:0 }}>
            <label className="form-label">Location *</label>
            <input className="form-input" value={form.location} onChange={set('location')} />
          </div>
          <div className="form-group" style={{ margin:0 }}>
            <label className="form-label">Capacity (leave empty = unlimited)</label>
            <input className="form-input" type="number" value={form.capacity} onChange={set('capacity')} />
          </div>
          <div className="form-group" style={{ gridColumn:'1/-1', margin:0 }}>
            <label className="form-label">Tags (comma separated)</label>
            <input className="form-input" value={form.tags} onChange={set('tags')} placeholder="ai, workshop, tech" />
          </div>
          <div className="form-group" style={{ margin:0 }}>
            <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontSize:14 }}>
              <input type="checkbox" checked={form.isFeatured} onChange={set('isFeatured')} style={{ accentColor:'var(--accent)' }} />
              ⭐ Featured event
            </label>
          </div>
        </div>
      </Modal>
    </div>
  );
}
