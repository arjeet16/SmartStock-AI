export function generateNotifications(
  products,
  forecastData,
  totalRevenue,
  totalProfit
) {
  const notifications = [];

  const lowStock = products.filter(p => Number(p.quantity) < 25);

  lowStock.forEach(product => {
    notifications.push({
      type: "danger",
      title: "Restock Alert",
      message: `${product.item_name} is running low (${product.quantity} units left).`,
    });
  });

  const bestForecast = forecastData.find(
    p => p.recommendedRestock > 0
  );

  if (bestForecast) {
    notifications.push({
      type: "info",
      title: "AI Recommendation",
      message: `Restock ${bestForecast.productName} (${bestForecast.recommendedRestock} units).`,
    });
  }

  notifications.push({
    type: "success",
    title: "Revenue Update",
    message: `Today's revenue ₹${totalRevenue.toLocaleString("en-IN")}`,
  });

  notifications.push({
    type: "success",
    title: "Profit Update",
    message: `Net profit ₹${totalProfit.toLocaleString("en-IN")}`,
  });

  return notifications.slice(0, 3);
}