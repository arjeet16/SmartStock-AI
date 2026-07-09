import Card from "./ui/Card";
import { generateSmartAlerts } from "../utils/alertEngine";

function SmartAlerts({ forecastData = [] }) {
  const { alerts, totalAlerts } = generateSmartAlerts({
    forecastData,
  });

  if (!totalAlerts) {
    return (
      <Card className="smart-alerts">
        <h2>🔔 AI Smart Alerts</h2>
        <p className="smart-alert-empty">No critical alerts right now.</p>
      </Card>
    );
  }

  return (
    <Card className="smart-alerts">
      <div className="smart-alerts-header">
        <div>
          <h2>🔔 AI Smart Alerts</h2>
          <p>{totalAlerts} alert(s) generated from forecast intelligence.</p>
        </div>

        <span>{totalAlerts} Active</span>
      </div>

      <div className="smart-alerts-list">
        {alerts.slice(0, 5).map((alert, index) => (
          <div className={`smart-alert smart-alert-${alert.type}`} key={index}>
            <div className="smart-alert-icon">{alert.icon}</div>

            <div>
              <h3>{alert.title}</h3>
              <p>{alert.message}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default SmartAlerts;