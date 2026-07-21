import { authFetch } from "./authFetch";

export async function askCopilot(payload) {
  const data = await authFetch("/ai-chat", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!data.answer) {
    throw new Error(
      "SmartStock AI returned an empty response."
    );
  }

  return data.answer;
}