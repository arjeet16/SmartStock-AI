const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000";

export async function askCopilot(payload) {
  const response = await fetch(
    `${API_BASE_URL}/ai-chat`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message ||
        "Unable to contact SmartStock AI"
    );
  }

  if (!data.answer) {
    throw new Error(
      "SmartStock AI returned an empty response"
    );
  }

  return data.answer;
}