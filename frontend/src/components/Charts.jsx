import { Bar, Pie } from "react-chartjs-2";

function Charts({ barChartData, pieChartData }) {
  return (
    <div className="charts">
      <div className="chart-box">
        <h2>📊 Stock Quantity Chart</h2>
        <Bar data={barChartData} />
      </div>

      <div className="chart-box">
        <h2>🥧 Category Distribution</h2>
        <Pie data={pieChartData} />
      </div>
    </div>
  );
}

export default Charts;