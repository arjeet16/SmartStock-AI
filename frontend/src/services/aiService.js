import { authFetch } from "./authFetch";

export async function generateAIReport(payload) {
  const data = await authFetch("/ai-report", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!data.report) {
    throw new Error(
      "AI report could not be generated."
    );
  }

  return data.report;
}