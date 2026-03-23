import { useState, useEffect } from 'react';
import api from '../utils/api';
import NewsCard from '../components/NewsCard';
import { LoadingPage } from '../components/Loader';
import Modal from '../components/Modal';
import { formatDate, formatRelative, newsCategories } from '../utils/helpers';

const CATS = ['all', 'announcement', 'academic', 'administrative', 'achievement', 'general'];

export default function NewsPage() {
  const [news, setNews]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat]         = useState('all');
  const [search, setSearch]   = useState('');
  const [selected, setSelected] = useState(null);

  const fetchNews = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (cat !== 'all') params.set('category', cat);
    if (search) params.set('search', search);
    api.get(`/news?${params}`)
      .then(res => setNews(res.data.news))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchNews(); }, [cat, search]);

  const openArticle = async (article) => {
    setSelected(article);
    // fetch full article with view count
    try {
      const res = await api.get(`/news/${article._id}`);
      setSelected(res.data.article);
    } catch {}
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Campus News</h1>
          <p className="page-subtitle">Stay updated with the latest ESTIN announcements</p>
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom:20 }}>
        <div className="search-bar" style={{ maxWidth:400 }}>
          <span style={{ color:'var(--text-muted)' }}>🔍</span>
          <input
            placeholder="Search news…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Category chips */}
      <div className="filter-chips">
        {CATS.map(c => (
          <div key={c} className={`chip ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>
            {c === 'all' ? 'All' : newsCategories[c]}
          </div>
        ))}
      </div>

      {loading ? (
        <LoadingPage />
      ) : news.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📰</div>
          <div className="empty-title">No articles found</div>
          <div className="empty-text">Check back later for updates</div>
        </div>
      ) : (
        <div className="grid-2">
          {news.map(article => (
            <NewsCard key={article._id} article={article} onClick={openArticle} />
          ))}
        </div>
      )}

      {/* Article Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.title} size="lg">
        {selected && (
          <div>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:16, alignItems:'center' }}>
              <span className="badge badge-gray">{newsCategories[selected.category] || selected.category}</span>
              {selected.isPinned && <span className="badge badge-green">📌 Pinned</span>}
              <span style={{ fontSize:13, color:'var(--text-muted)' }}>
                {formatDate(selected.createdAt)} · {formatRelative(selected.createdAt)}
              </span>
              <span style={{ fontSize:13, color:'var(--text-muted)', marginLeft:'auto' }}>
                👁 {selected.views} views
              </span>
            </div>

            <div style={{ color:'var(--text-secondary)', lineHeight:1.8, whiteSpace:'pre-wrap', marginBottom:18 }}>
              {selected.content}
            </div>

            {selected.tags?.length > 0 && (
              <div style={{ display:'flex', gap:8, flexWrap:'wrap', borderTop:'1px solid var(--border-subtle)', paddingTop:16 }}>
                {selected.tags.map(tag => (
                  <span key={tag} className="badge badge-gray">#{tag}</span>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
