export function Spinner({ size = 32 }) {
  return (
    <div
      className="spinner"
      style={{ width: size, height: size, borderWidth: size > 24 ? 3 : 2 }}
    />
  );
}

export function LoadingPage() {
  return (
    <div className="loading-page">
      <div style={{ textAlign:'center' }}>
        <Spinner size={40} />
        <p style={{ marginTop:16, color:'var(--text-secondary)', fontSize:14 }}>Loading…</p>
      </div>
    </div>
  );
}
