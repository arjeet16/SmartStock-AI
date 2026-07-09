import { API_BASE_URL } from "./api";

export async function getMLMetrics() {
  const response = await fetch(`${API_BASE_URL}/ml-metrics`);

  if (!response.ok) {
    throw new Error("Failed to fetch ML metrics");
  }

  const data = await response.json();

  return data.metrics;
}