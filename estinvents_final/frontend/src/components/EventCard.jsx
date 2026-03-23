import { formatDate } from '../utils/helpers';

const catColors = {
  academic: '#5082ff', cultural: '#ff64b4', sports: '#ffa500',
  workshop: '#00C896', conference: '#a064ff', club: '#ff5050', other: '#888',
};

export default function EventCard({ event, onClick }) {
  const color = catColors[event.category] || catColors.other;
  const spotsLeft = event.capacity ? event.capacity - event.registeredCount : null;

  return (
    <div className="event-card" onClick={() => onClick?.(event)}>
      <div
        className="event-card-header"
        style={{ background: `linear-gradient(135deg, ${color}22 0%, #0C1122 100%)` }}
      >
        {/* Category badge */}
        <div className="event-card-cat">
          <span className={`badge cat-${event.category}`} style={{ fontSize:11 }}>
            {event.category}
          </span>
        </div>

        {/* Date badge at bottom */}
        <div className="event-date-badge">
          📅 {formatDate(event.date)}
        </div>
      </div>

      <div className="event-card-body">
        <div className="event-card-title">{event.title}</div>
        <p style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.5, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
          {event.description}
        </p>
        <div className="event-card-meta">
          <div className="event-meta-row">
            <span>📍</span>
            <span className="truncate">{event.location}</span>
          </div>
          <div className="event-meta-row">
            <span>👤</span>
            <span className="truncate">{event.organizer}</span>
          </div>
          {spotsLeft !== null && (
            <div className="event-meta-row">
              <span>🎟️</span>
              <span style={{ color: spotsLeft < 10 ? '#ff4b4b' : 'var(--text-secondary)' }}>
                {spotsLeft > 0 ? `${spotsLeft} spots left` : 'Full'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
