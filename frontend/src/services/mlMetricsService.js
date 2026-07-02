export async function getMLMetrics() {
  const response = await fetch("http://localhost:5000/ml-metrics");

  if (!response.ok) {
    throw new Error("Failed to fetch ML metrics");
  }

  const data = await response.json();

  return data.metrics;
}