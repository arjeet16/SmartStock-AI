export default function ForecastTable({ forecastData = [] }) {
  const getRiskClass = (risk) => {
    if (risk === "High") return "risk-high";
    if (risk === "Medium") return "risk-medium";
    return "risk-low";
  };

  return (
    <section className="report-page">

      <h1 className="forecast-title">
        Product Forecast Intelligence
      </h1>

      <p className="forecast-subtitle">
        AI Forecast generated using Random Forest Regressor and inventory analytics.
      </p>

      <table className="forecast-report-table">

        <thead>

          <tr>
            <th>#</th>
            <th>Product</th>
            <th>Category</th>
            <th>Stock</th>
            <th>ML Forecast</th>
            <th>Restock</th>
            <th>Confidence</th>
            <th>Risk</th>
          </tr>

        </thead>

        <tbody>

          {forecastData.map((item, index) => {

            const forecast =
              item.mlForecast30Days ?? item.forecast30Days;

            const restock =
              item.mlRecommendedRestock ??
              item.recommendedRestock;

            return (

              <tr key={item.productId}>

                <td>{index + 1}</td>

                <td>{item.productName}</td>

                <td>{item.category}</td>

                <td>{item.currentStock}</td>

                <td>{forecast}</td>

                <td>{restock}</td>

                <td>{item.confidence}%</td>

                <td>

                  <span
                    className={`forecast-risk ${getRiskClass(item.risk)}`}
                  >
                    {item.risk}
                  </span>

                </td>

              </tr>

            );
          })}

        </tbody>

      </table>

      <div className="forecast-summary-box">

        <h2>AI Summary</h2>

        <p>
          Products with Medium or High risk should be prioritized for
          replenishment. Low-risk products currently have sufficient inventory
          based on the AI forecast.
        </p>

      </div>

    </section>
  );
}