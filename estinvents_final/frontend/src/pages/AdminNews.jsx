import { useState, useEffect } from 'react';
import api from '../utils/api';
import Modal from '../components/Modal';
import { LoadingPage } from '../components/Loader';
import { useToast } from '../context/ToastContext';
import { formatDate, newsCategories } from '../utils/helpers';

const EMPTY = { title:'', content:'', excerpt:'', category:'general', tags:'', isPinned:false, isPublished:true };

export default function AdminNews() {
  const [news, setNews]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]   = useState(null);
  const [form, setForm]     = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const fetchNews = () => {
    setLoading(true);
    api.get('/news?limit=50').then(r => setNews(r.data.news)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchNews(); }, []);

  const set = (k) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(prev => ({ ...prev, [k]: val }));
  };

  const openCreate = () => { setForm(EMPTY); setModal('create'); };
  const openEdit   = (a) => {
    setForm({ ...a, tags: Array.isArray(a.tags) ? a.tags.join(', ') : '' });
    setModal('edit');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        excerpt: form.excerpt || form.content.substring(0, 200),
      };
      if (modal === 'create') {
        await api.post('/news', payload);
        toast.success('Article created! 📰');
      } else {
        await api.put(`/news/${form._id}`, payload);
        toast.success('Article updated ✅');
      }
      setModal(null);
      fetchNews();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this article?')) return;
    try {
      await api.delete(`/news/${id}`);
      toast.success('Article deleted');
      fetchNews();
    } catch { toast.error('Delete failed'); }
  };

  const handlePin = async (article) => {
    try {
      await api.put(`/news/${article._id}`, { ...article, isPinned: !article.isPinned });
      fetchNews();
      toast.success(article.isPinned ? 'Unpinned' : 'Pinned 📌');
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage News</h1>
          <p className="page-subtitle">{news.length} articles</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ New Article</button>
      </div>

      {loading ? <LoadingPage /> : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {news.map(a => (
            <div key={a._id} className="card" style={{ display:'flex', alignItems:'center', gap:16, padding:'16px 20px' }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', gap:8, marginBottom:4, flexWrap:'wrap' }}>
                  <span className="badge badge-gray">{newsCategories[a.category]}</span>
                  {a.isPinned    && <span className="badge badge-green">📌 Pinned</span>}
                  {!a.isPublished && <span className="badge badge-red">Draft</span>}
                </div>
                <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:15 }} className="truncate">{a.title}</div>
                <div style={{ fontSize:13, color:'var(--text-secondary)', marginTop:2 }}>
                  📅 {formatDate(a.createdAt)} · 👁 {a.views} views
                </div>
              </div>
              <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => handlePin(a)} title={a.isPinned ? 'Unpin' : 'Pin'}>
                  {a.isPinned ? '📌' : '📍'}
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => openEdit(a)}>✏️ Edit</button>
                <button className="btn btn-danger btn-sm"    onClick={() => handleDelete(a._id)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal === 'create' ? 'Create Article' : 'Edit Article'}
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
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div className="form-group" style={{ margin:0 }}>
            <label className="form-label">Title *</label>
            <input className="form-input" value={form.title} onChange={set('title')} required />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            <div className="form-group" style={{ margin:0 }}>
              <label className="form-label">Category</label>
              <select className="form-select" value={form.category} onChange={set('category')}>
                {Object.entries(newsCategories).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ margin:0 }}>
              <label className="form-label">Tags (comma separated)</label>
              <input className="form-input" value={form.tags} onChange={set('tags')} placeholder="estin, news, update" />
            </div>
          </div>
          <div className="form-group" style={{ margin:0 }}>
            <label className="form-label">Excerpt (optional — auto-generated if empty)</label>
            <input className="form-input" value={form.excerpt} onChange={set('excerpt')} placeholder="Short summary…" />
          </div>
          <div className="form-group" style={{ margin:0 }}>
            <label className="form-label">Content *</label>
            <textarea className="form-textarea" value={form.content} onChange={set('content')} rows={8} required />
          </div>
          <div style={{ display:'flex', gap:24 }}>
            <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontSize:14 }}>
              <input type="checkbox" checked={form.isPinned} onChange={set('isPinned')} style={{ accentColor:'var(--accent)' }} />
              📌 Pin article
            </label>
            <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontSize:14 }}>
              <input type="checkbox" checked={form.isPublished} onChange={set('isPublished')} style={{ accentColor:'var(--accent)' }} />
              🌐 Published
            </label>
          </div>
        </div>
      </Modal>
    </div>
  );
}
