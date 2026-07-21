import { authFetch } from "./authFetch";

export async function getDemandForecast() {
  const data = await authFetch("/forecast");

  return Array.isArray(data.forecast)
    ? data.forecast
    : [];
}