import { formatRelative } from '../utils/helpers';

const catColors = {
  announcement: '#00C896', academic: '#5082ff', administrative: '#a064ff',
  achievement: '#ffa500', general: '#888',
};

export default function NewsCard({ article, onClick }) {
  return (
    <div className="news-card" onClick={() => onClick?.(article)}>
      <div className="news-card-body">
        {article.isPinned && (
          <div className="news-pinned-badge">📌 Pinned</div>
        )}
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8, flexWrap:'wrap' }}>
          <span
            className="badge"
            style={{ background: `${catColors[article.category]}18`, color: catColors[article.category], fontSize:11 }}
          >
            {article.category}
          </span>
          <span style={{ fontSize:12, color:'var(--text-muted)' }}>
            {formatRelative(article.createdAt)}
          </span>
        </div>
        <div className="news-card-title">{article.title}</div>
        <p className="news-card-excerpt">
          {article.excerpt || article.content?.substring(0, 160) + '...'}
        </p>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:12, fontSize:12, color:'var(--text-muted)' }}>
          <span>✍️ {article.author?.firstName} {article.author?.lastName}</span>
          <span>👁 {article.views || 0} views</span>
        </div>
      </div>
    </div>
  );
}
