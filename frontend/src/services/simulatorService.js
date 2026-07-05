export async function runScenarioSimulation(payload) {
  const response = await fetch("http://localhost:5000/scenario-simulate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Scenario simulation failed");
  }

  const data = await response.json();

  return data.simulation;
}