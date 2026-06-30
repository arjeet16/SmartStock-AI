export async function generateAIReport(payload) {
  try {
    const response = await fetch("http://localhost:5000/ai-report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    if (typeof data.report === "string") {
  return JSON.parse(data.report);
}

return data.report;
  } catch (error) {
    console.error(error);
    throw error;
  }
}