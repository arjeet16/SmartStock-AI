import { useEffect, useRef, useState } from "react";
import { FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa";
import { askCopilot } from "../services/copilotService";
import ReactMarkdown from "react-markdown";
function AICopilot({
  products,
  sales,
  totalRevenue,
  totalProfit,
  lowStockCount,
  bestSellingProduct,
}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hi Arjeet 👋 Ask me anything about your inventory, sales, profit, or restocking.",
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const sendMessage = async () => {
    if (!input.trim() || thinking) return;

    const userQuestion = input.trim();

    setMessages((prev) => [
      ...prev,
      { role: "user", text: userQuestion },
    ]);

    setInput("");
    setThinking(true);

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
        ...prev,
        {
          role: "ai",
          text: typeof reply === "string" ? reply : "AI response generated.",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Sorry, I could not connect to AI." },
      ]);
    } finally {
      setThinking(false);
    }
  };

  return (
    <>
      <button className="ai-copilot-button" onClick={() => setOpen(true)}>
        <FaRobot />
      </button>

      {open && (
  <>
    <div
      className="copilot-backdrop"
      onClick={() => setOpen(false)}
    />
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
                className={`chat-row ${
                  msg.role === "user" ? "chat-row-user" : "chat-row-ai"
                }`}
              >
                {msg.role === "ai" && <div className="chat-avatar">🤖</div>}

                <div
  className={`ai-message ${
    msg.role === "user" ? "user-message" : "bot-message"
  }`}
>
  {msg.role === "ai" ? (
    <ReactMarkdown>{msg.text}</ReactMarkdown>
  ) : (
    msg.text
  )}
</div>

                {msg.role === "user" && <div className="chat-avatar user-avatar-mini">A</div>}
              </div>
            ))}

            {thinking && (
              <div className="chat-row chat-row-ai">
                <div className="chat-avatar">🤖</div>
                <div className="ai-message bot-message typing">
                  Thinking<span>.</span><span>.</span><span>.</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="ai-copilot-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about stock, profit, sales..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            <button onClick={sendMessage} disabled={thinking}>
              <FaPaperPlane />
            </button>
          </div>
        </div>
         </>
      )}
    </>
  );
}

export default AICopilot;
