import { useState } from "react";
import { FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa";
import { askCopilot } from "../services/copilotService";

function AICopilot({ products, sales, totalRevenue, totalProfit, lowStockCount, bestSellingProduct }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hi Arjeet 👋 Ask me anything about your inventory, sales, profit, or restocking.",
    },
  ]);
  const [input, setInput] = useState("");
const sendMessage = async () => {
  if (!input.trim()) return;

  const userQuestion = input;

  setMessages((prev) => [
    ...prev,
    { role: "user", text: userQuestion },
    { role: "ai", text: "Thinking..." },
  ]);

  setInput("");

  try {
    const reply = await askCopilot(userQuestion, {
      products,
      sales,
      totalRevenue,
      totalProfit,
      lowStockCount,
      bestSellingProduct,
    });

    setMessages((prev) => [
      ...prev.slice(0, -1),
      {
        role: "ai",
        text:
          typeof reply === "string"
            ? reply
            : reply.summary || "AI response generated.",
      },
    ]);
  } catch (error) {
    setMessages((prev) => [
      ...prev.slice(0, -1),
      { role: "ai", text: "Sorry, I could not connect to AI." },
    ]);
  }
};


  return (
    <>
      <button className="ai-copilot-button" onClick={() => setOpen(true)}>
        <FaRobot />
      </button>

      {open && (
        <div className="ai-copilot-window">
          <div className="ai-copilot-header">
            <div>
              <h3>🤖 SmartStock Copilot</h3>
              <p>Inventory-aware AI assistant</p>
            </div>

            <button onClick={() => setOpen(false)}>
              <FaTimes />
            </button>
          </div>

          <div className="ai-copilot-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`ai-message ${
                  msg.role === "user" ? "user-message" : "bot-message"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="ai-copilot-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about stock, profit, sales..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            <button onClick={sendMessage}>
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default AICopilot;
