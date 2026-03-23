import { useState, useEffect } from 'react';
import api from '../utils/api';
import Modal from '../components/Modal';
import { LoadingPage } from '../components/Loader';
import { useToast } from '../context/ToastContext';
import { statusConfig } from '../utils/helpers';

const DEPTS = ['Computer Science', 'Electronics', 'Mathematics', 'Telecommunications', 'Physics', 'Other'];
const EMPTY = { name:'', department:'Computer Science', email:'', modules:'', status:'unknown', statusNote:'', schedule:[] };

export default function AdminProfessors() {
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading]  = useState(true);
  const [modal, setModal]      = useState(null);
  const [form, setForm]        = useState(EMPTY);
  const [saving, setSaving]    = useState(false);
  const toast = useToast();

  const fetchProfs = () => {
    setLoading(true);
    api.get('/professors').then(r => setProfessors(r.data.professors)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProfs(); }, []);

  const set = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }));

  const openCreate = () => { setForm(EMPTY); setModal('create'); };
  const openEdit   = (p) => {
    setForm({ ...p, modules: Array.isArray(p.modules) ? p.modules.join(', ') : '' });
    setModal('edit');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        modules: form.modules ? form.modules.split(',').map(m => m.trim()).filter(Boolean) : [],
      };
      if (modal === 'create') {
        await api.post('/professors', payload);
        toast.success('Professor added! 🎓');
      } else {
        await api.put(`/professors/${form._id}`, payload);
        toast.success('Professor updated ✅');
      }
      setModal(null);
      fetchProfs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this professor?')) return;
    try {
      await api.delete(`/professors/${id}`);
      toast.success('Professor removed');
      fetchProfs();
    } catch { toast.error('Delete failed'); }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const note = status === 'absent' ? window.prompt('Reason for absence (optional):') || '' : '';
      await api.patch(`/professors/${id}/status`, { status, statusNote: note });
      fetchProfs();
      toast.success('Status updated ✅');
    } catch { toast.error('Update failed'); }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Professors</h1>
          <p className="page-subtitle">{professors.length} professors · Update attendance in real-time</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Professor</button>
      </div>

      {loading ? <LoadingPage /> : (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {professors.map(p => {
            const sc = statusConfig[p.status] || statusConfig.unknown;
            return (
              <div key={p._id} className="card" style={{ display:'flex', alignItems:'center', gap:16, padding:'14px 20px' }}>
                {/* Avatar */}
                <div className="prof-avatar" style={{ width:44, height:44, fontSize:16, borderRadius:'50%', background:'linear-gradient(135deg,#00C896,#0f5f42)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontFamily:'var(--font-display)', flexShrink:0 }}>
                  {(p.name||'').split(' ').slice(0,2).map(n=>n[0]||'').join('').toUpperCase()}
                </div>

                {/* Info */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:700, fontSize:15, marginBottom:2 }}>{p.name}</div>
                  <div style={{ fontSize:13, color:'var(--text-secondary)' }}>
                    {p.department}
                    {p.modules?.length > 0 && ` · ${p.modules.slice(0,2).join(', ')}`}
                  </div>
                  {p.statusNote && (
                    <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2, fontStyle:'italic' }}>
                      {p.statusNote}
                    </div>
                  )}
                </div>

                {/* Status quick-change */}
                <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                  {['present','absent','unknown'].map(s => (
                    <button
                      key={s}
                      className={`btn btn-sm ${p.status === s ? 'btn-primary' : 'btn-secondary'}`}
                      style={p.status === s ? { background: s==='present' ? '#00C896' : s==='absent' ? '#ff4b4b' : '#888' } : {}}
                      onClick={() => handleStatusChange(p._id, s)}
                    >
                      {s === 'present' ? '✅' : s === 'absent' ? '❌' : '❓'}
                    </button>
                  ))}
                </div>

                {/* Actions */}
                <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => openEdit(p)}>✏️</button>
                  <button className="btn btn-danger btn-sm"    onClick={() => handleDelete(p._id)}>🗑️</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal === 'create' ? 'Add Professor' : 'Edit Professor'}
        size="md"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? '⏳ Saving…' : (modal === 'create' ? '+ Add' : '✅ Save')}
            </button>
          </>
        }
      >
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          <div className="form-group" style={{ gridColumn:'1/-1', margin:0 }}>
            <label className="form-label">Full Name *</label>
            <input className="form-input" value={form.name} onChange={set('name')} placeholder="Dr. Amina Bensalem" required />
          </div>
          <div className="form-group" style={{ margin:0 }}>
            <label className="form-label">Department *</label>
            <select className="form-select" value={form.department} onChange={set('department')}>
              {DEPTS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ margin:0 }}>
            <label className="form-label">Email</label>
            <input className="form-input" type="email" value={form.email} onChange={set('email')} placeholder="a.bensalem@estin.dz" />
          </div>
          <div className="form-group" style={{ gridColumn:'1/-1', margin:0 }}>
            <label className="form-label">Modules (comma separated)</label>
            <input className="form-input" value={form.modules} onChange={set('modules')} placeholder="Algorithms, Data Structures" />
          </div>
          <div className="form-group" style={{ margin:0 }}>
            <label className="form-label">Initial Status</label>
            <select className="form-select" value={form.status} onChange={set('status')}>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>
          <div className="form-group" style={{ margin:0 }}>
            <label className="form-label">Status Note</label>
            <input className="form-input" value={form.statusNote} onChange={set('statusNote')} placeholder="e.g. On leave" />
          </div>
        </div>
      </Modal>
    </div>
  );
}
