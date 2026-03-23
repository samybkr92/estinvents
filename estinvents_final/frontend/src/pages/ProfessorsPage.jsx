import { useState, useEffect } from 'react';
import api from '../utils/api';
import ProfessorCard from '../components/ProfessorCard';
import { LoadingPage } from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const DEPTS = ['All', 'Computer Science', 'Electronics', 'Mathematics', 'Telecommunications'];

export default function ProfessorsPage() {
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dept, setDept]       = useState('All');
  const [status, setStatus]   = useState('all');
  const [search, setSearch]   = useState('');
  const { user } = useAuth();
  const toast = useToast();
  const isAdmin = user?.role === 'admin';

  const fetchProfessors = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (dept !== 'All') params.set('department', dept);
    if (status !== 'all') params.set('status', status);
    if (search) params.set('search', search);
    api.get(`/professors?${params}`)
      .then(res => setProfessors(res.data.professors))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProfessors(); }, [dept, status, search]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/professors/${id}/status`, { status: newStatus });
      setProfessors(prev =>
        prev.map(p => p._id === id ? { ...p, status: newStatus } : p)
      );
      toast.success('Status updated ✅');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const counts = {
    all:     professors.length,
    present: professors.filter(p => p.status === 'present').length,
    absent:  professors.filter(p => p.status === 'absent').length,
    unknown: professors.filter(p => p.status === 'unknown').length,
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Professors</h1>
          <p className="page-subtitle">Real-time attendance and schedule information</p>
        </div>
      </div>

      {/* Status summary cards */}
      <div className="grid-4" style={{ marginBottom:28 }}>
        {[
          { label:'Total',   val:counts.all,     bg:'var(--bg-input)', color:'var(--text)' },
          { label:'Present', val:counts.present, bg:'rgba(0,200,150,0.1)', color:'#00C896' },
          { label:'Absent',  val:counts.absent,  bg:'rgba(255,75,75,0.1)', color:'#ff4b4b' },
          { label:'Unknown', val:counts.unknown, bg:'rgba(136,136,136,0.1)', color:'#888' },
        ].map(s => (
          <div className="stat-card" key={s.label} style={{ background: s.bg, border:'1px solid var(--border)' }}>
            <div className="stat-info">
              <div className="stat-value" style={{ color: s.color, fontSize:28 }}>{s.val}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap', alignItems:'center' }}>
        <div className="search-bar" style={{ flex:1, minWidth:200 }}>
          <span style={{ color:'var(--text-muted)' }}>🔍</span>
          <input
            placeholder="Search professors…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="form-select"
          style={{ width:'auto' }}
          value={dept}
          onChange={e => setDept(e.target.value)}
        >
          {DEPTS.map(d => <option key={d}>{d}</option>)}
        </select>
      </div>

      {/* Status tabs */}
      <div className="tabs">
        {['all','present','absent','unknown'].map(s => (
          <div
            key={s}
            className={`tab ${status === s ? 'active' : ''}`}
            onClick={() => setStatus(s)}
          >
            {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            <span style={{ marginLeft:6, fontSize:12, opacity:0.7 }}>({counts[s]})</span>
          </div>
        ))}
      </div>

      {loading ? (
        <LoadingPage />
      ) : professors.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👨‍🏫</div>
          <div className="empty-title">No professors found</div>
          <div className="empty-text">Try adjusting your filters</div>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {professors.map(p => (
            <ProfessorCard
              key={p._id}
              professor={p}
              isAdmin={isAdmin}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {isAdmin && (
        <p style={{ fontSize:12, color:'var(--text-muted)', marginTop:16, textAlign:'center' }}>
          ⚡ As admin, click the ▼ next to any status badge to update it in real-time.
        </p>
      )}
    </div>
  );
}
