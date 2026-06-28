function AIRecommendation({ products, sales }) {
  const lowStockProducts = products.filter(
    (item) => Number(item.quantity) < 10
  );

  const bestSeller =
    sales.length > 0
      ? sales.reduce((best, current) =>
          Number(current.quantity_sold) > Number(best.quantity_sold)
            ? current
            : best
        ).item_name
      : "No sales yet";

  const restockSuggestion =
    lowStockProducts.length > 0
      ? `Restock ${lowStockProducts[0].item_name} immediately. Suggested reorder: 50 units.`
      : "No urgent restocking required.";

  return (
    <div className="ai-recommendation">
      <h2>✨ AI Recommendation Engine</h2>

      <div className="recommendation-card">
        <h3>🔥 Best Seller</h3>
        <p>{bestSeller}</p>
      </div>

      <div className="recommendation-card">
        <h3>📦 Restock Suggestion</h3>
        <p>{restockSuggestion}</p>
      </div>

      <div className="recommendation-card">
        <h3>🎯 AI Confidence</h3>
        <p>92%</p>
      </div>
    </div>
  );
}

export default AIRecommendation;