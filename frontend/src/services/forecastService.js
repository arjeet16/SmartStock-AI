export async function getForecast() {
  const response = await fetch("http://localhost:5000/forecast");

  if (!response.ok) {
    throw new Error("Failed to fetch forecast");
  }

  const data = await response.json();

  return data.forecast || [];
}