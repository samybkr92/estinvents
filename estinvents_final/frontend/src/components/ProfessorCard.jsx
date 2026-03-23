import { statusConfig } from '../utils/helpers';

function getInitialsFromName(name) {
  const parts = (name || '').split(' ');
  return parts.slice(0, 2).map(p => p[0] || '').join('').toUpperCase();
}

export default function ProfessorCard({ professor, onStatusChange, isAdmin }) {
  const status = statusConfig[professor.status] || statusConfig.unknown;

  return (
    <div className="prof-card">
      <div className="prof-avatar">{getInitialsFromName(professor.name)}</div>

      <div className="prof-info">
        <div className="prof-name">{professor.name}</div>
        <div className="prof-dept">{professor.department}</div>
        {professor.modules?.length > 0 && (
          <div className="prof-modules">{professor.modules.join(' • ')}</div>
        )}
        {professor.statusNote && (
          <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:3, fontStyle:'italic' }}>
            {professor.statusNote}
          </div>
        )}
      </div>

      <div className="prof-status">
        <span className={`status-dot ${status.dot}`} />
        <span className={`badge ${status.cls}`}>{status.label}</span>
        {isAdmin && (
          <div style={{ position:'relative' }}>
            <select
              value={professor.status}
              onChange={e => onStatusChange?.(professor._id, e.target.value)}
              style={{
                position:'absolute', inset:0, opacity:0, cursor:'pointer', width:'100%'
              }}
            >
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="unknown">Unknown</option>
            </select>
            <span style={{ fontSize:12, color:'var(--text-muted)', cursor:'pointer' }}>▼</span>
          </div>
        )}
      </div>
    </div>
  );
}
