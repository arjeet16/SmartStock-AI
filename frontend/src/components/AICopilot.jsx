import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { FiCopy, FiCheck, FiTrash2, FiSend, FiX } from "react-icons/fi";
import { askCopilot } from "../services/copilotService";

const STORAGE_KEY = "smartstock_copilot_messages";

const suggestedPrompts = [
  "Analyze my inventory health",
  "Which products are low in stock?",
  "How can I increase profit?",
  "Give me today's sales summary",
  "Find business risks",
  "Recommend restocking actions",
];

const quickActions = [
  "Analyze inventory",
  "Show low stock risks",
  "Give profit tips",
  "Prepare CEO summary",
];

function getTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AICopilot({ products = [], sales = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: crypto.randomUUID(),
            role: "ai",
            text: "Hi, I’m your SmartStock AI Copilot. Ask me anything about inventory, sales, profit, risks, or restocking.",
            time: getTime(),
          },
        ];
  });

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${Math.min(
      textareaRef.current.scrollHeight,
      130
    )}px`;
  }, [input]);

  const sendMessage = async (customPrompt = null) => {
    const messageText = customPrompt || input.trim();
    if (!messageText || loading) return;

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: messageText,
      time: getTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const aiResponse = await askCopilot({
        message: messageText,
        products,
        sales,
      });

      const aiMessage = {
        id: crypto.randomUUID(),
        role: "ai",
        text: aiResponse || "I could not generate a response right now.",
        time: getTime(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "ai",
          text: "Something went wrong while contacting SmartStock AI. Please try again.",
          time: getTime(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyMessage = async (message) => {
    await navigator.clipboard.writeText(message.text);
    setCopiedId(message.id);

    setTimeout(() => {
      setCopiedId(null);
    }, 1800);
  };

  const clearChat = () => {
    const starter = [
      {
        id: crypto.randomUUID(),
        role: "ai",
        text: "Chat cleared. How can I help you with your business now?",
        time: getTime(),
      },
    ];

    setMessages(starter);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(starter));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <button
        className="ai-copilot-button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open AI Copilot"
      >
        {isOpen ? <FiX /> : "🤖"}
      </button>

      {isOpen && (
        <div className="ai-copilot-backdrop">
          <section className="ai-copilot-window">
            <header className="ai-copilot-header">
              <div>
                <h3>SmartStock AI</h3>
                <p>Inventory Intelligence Assistant</p>
              </div>

              <div className="ai-copilot-status">
                <span></span>
                Online
              </div>
            </header>

            <main className="ai-copilot-messages">
              {messages.length <= 1 && (
                <div className="ai-suggestions">
                  {suggestedPrompts.map((prompt) => (
                    <button key={prompt} onClick={() => sendMessage(prompt)}>
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`ai-message ${
                    message.role === "user" ? "user-message" : "bot-message"
                  }`}
                >
                  <div className="ai-message-meta">
                    <strong>{message.role === "user" ? "You" : "AI"}</strong>
                    <span>{message.time}</span>
                  </div>

                  <div className="ai-message-content">
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  </div>

                  {message.role === "ai" && (
                    <button
                      className="ai-copy-button"
                      onClick={() => copyMessage(message)}
                    >
                      {copiedId === message.id ? (
                        <>
                          <FiCheck /> Copied
                        </>
                      ) : (
                        <>
                          <FiCopy /> Copy
                        </>
                      )}
                    </button>
                  )}
                </div>
              ))}

              {loading && (
                <div className="ai-message bot-message typing-message">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </main>

            <div className="ai-quick-actions">
              {quickActions.map((action) => (
                <button key={action} onClick={() => sendMessage(action)}>
                  {action}
                </button>
              ))}

              <button className="clear-chat-btn" onClick={clearChat}>
                <FiTrash2 /> Clear
              </button>
            </div>

            <footer className="ai-copilot-input-area">

    <div className="ai-input-wrapper">

        <span className="ai-input-icon">
            ✨
        </span>

        <input
            type="text"
            value={input}
            placeholder="Ask about inventory, sales, risks or profit..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            spellCheck={false}
        />

    </div>

    <button
        className="send-btn"
        onClick={() => sendMessage()}
        disabled={!input.trim() || loading}
    >
        <FiSend />
    </button>

</footer>
          </section>
        </div>
      )}
    </>
  );
}
