import Card from "./ui/Card";
import { Bar, Doughnut } from "react-chartjs-2";

function AnalyticsV2({ barChartData, pieChartData }) {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="analytics-v2">
      <Card className="analytics-card">
        <div className="analytics-header">
          <div>
            <span>📊 Inventory Analytics</span>
            <h3>Stock Quantity Overview</h3>
          </div>
          <p className="trend-up">+12%</p>
        </div>

        <div className="analytics-chart">
          <Bar data={barChartData} options={chartOptions} />
        </div>
      </Card>

      <Card className="analytics-card">
        <div className="analytics-header">
          <div>
            <span>🥧 Category Insights</span>
            <h3>Category Distribution</h3>
          </div>
          <p className="trend-up">Healthy</p>
        </div>

        <div className="analytics-chart">
          <Doughnut data={pieChartData} options={chartOptions} />
        </div>
      </Card>
    </div>
  );
}

export default AnalyticsV2;