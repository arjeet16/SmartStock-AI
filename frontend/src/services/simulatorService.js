export async function simulateForecast(payload) {
  const response = await fetch("http://localhost:5000/forecast/simulate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to simulate forecast");
  }

  const data = await response.json();
  return data;
}