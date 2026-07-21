import { authFetch } from "./authFetch";

export async function getMLMetrics() {
  const data = await authFetch("/ml-metrics");

  return data.metrics || data;
}