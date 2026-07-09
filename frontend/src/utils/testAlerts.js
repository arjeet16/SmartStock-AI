import { generateSmartAlerts } from "./alertEngine";

export function testAlertEngine(forecastData) {
  const result = generateSmartAlerts({
    forecastData,
  });

  console.log("========== SMART ALERT ENGINE ==========");
  console.table(result.alerts);
  console.log("Total Alerts:", result.totalAlerts);
  console.log("Critical:", result.criticalAlerts);
  console.log("Warning:", result.warningAlerts);
  console.log("Opportunity:", result.opportunityAlerts);

  return result;
}