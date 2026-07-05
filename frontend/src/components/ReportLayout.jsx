import ExecutiveCover from "./ExecutiveCover";
import ExecutiveDashboard from "./ExecutiveDashboard";
import ForecastTable from "./ForecastTable";
import MLDashboard from "./MLDashboard";
import FinancialDashboard from "./FinancialDashboard";

import "./ExecutiveCover.css";

export default function ReportLayout({
  forecastData = [],
  mlMetrics = null,
  scenario = null,
  businessScore = 85,
  businessHealth = "Good",
}) {
  return (
    <div
      id="enterprise-report"
    style={{
  position: "fixed",
  top: 0,
  left: "-99999px",
  visibility: "hidden",
  pointerEvents: "none",
  background: "#f8fafc",
}}
    >
      <ExecutiveCover
        businessScore={businessScore}
        businessHealth={businessHealth}
        generatedAt={new Date().toLocaleString()}
      />

      <ExecutiveDashboard
        forecastData={forecastData}
        businessScore={businessScore}
      />

      <ForecastTable
        forecastData={forecastData}
      />

      <MLDashboard
        metrics={mlMetrics}
      />

      <FinancialDashboard
        forecastData={forecastData}
        scenario={scenario}
      />
    </div>
  );
}