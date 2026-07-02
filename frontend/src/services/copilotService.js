export async function askCopilot(payload) {
  const response = await fetch("http://localhost:5000/ai-chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  return data.answer;
}