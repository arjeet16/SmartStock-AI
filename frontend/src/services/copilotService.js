export async function askCopilot(question, context) {
  const response = await fetch("http://localhost:5000/ai-chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question,
      ...context,
    }),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "AI request failed");
  }

  return data.answer;
}