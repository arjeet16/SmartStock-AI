function DashboardSkeleton() {
  return (
    <div className="dashboard-skeleton" aria-label="Loading dashboard">
      <div className="skeleton-hero">
        <div className="skeleton-block skeleton-badge" />
        <div className="skeleton-block skeleton-title" />
        <div className="skeleton-block skeleton-text" />
        <div className="skeleton-block skeleton-text skeleton-text-short" />

        <div className="skeleton-actions">
          <div className="skeleton-block skeleton-button" />
          <div className="skeleton-block skeleton-button" />
        </div>
      </div>

      <div className="skeleton-card-grid">
        {Array.from({ length: 4 }).map((_, index) => (
          <div className="skeleton-card" key={index}>
            <div className="skeleton-block skeleton-icon" />
            <div className="skeleton-block skeleton-label" />
            <div className="skeleton-block skeleton-value" />
            <div className="skeleton-block skeleton-small" />
          </div>
        ))}
      </div>

      <div className="skeleton-analytics-grid">
        <div className="skeleton-panel">
          <div className="skeleton-block skeleton-panel-title" />
          <div className="skeleton-chart-bars">
            {Array.from({ length: 8 }).map((_, index) => (
              <i key={index} />
            ))}
          </div>
        </div>

        <div className="skeleton-panel">
          <div className="skeleton-block skeleton-panel-title" />
          <div className="skeleton-donut" />
        </div>
      </div>
    </div>
  );
}

export default DashboardSkeleton;