function LiveBadge({ label = "Live" }) {
  return (
    <div className="live-badge">
      <i></i>
      {label}
    </div>
  );
}

export default LiveBadge;