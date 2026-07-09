import { API_BASE_URL } from "./api";

export async function generateAIReport(payload) {
  try {
    const response = await fetch(`${API_BASE_URL}/ai-report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("AI report request failed");
    }

    return await response.json();
  } catch (error) {
    console.error("AI report error:", error);
    throw error;
  }
}