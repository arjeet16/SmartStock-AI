import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  FiCopy,
  FiCheck,
  FiTrash2,
  FiSend,
  FiX,
  FiRefreshCw,
  FiThumbsUp,
  FiThumbsDown,
} from "react-icons/fi";
import { askCopilot } from "../services/copilotService";

const STORAGE_KEY = "smartstock_copilot_messages";
const CHAT_VERSION_KEY = "smartstock_copilot_version";
const CHAT_VERSION = "v2";

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

function getStarterMessage() {
  return [
    {
      id: crypto.randomUUID(),
      role: "ai",
      text: `Good evening, Arjeet 👋

Welcome back to your AI command center.

I can analyze your inventory, detect low-stock risks, summarize sales, find profit opportunities, and recommend restocking actions.

What would you like to investigate first?`,
      time: getTime(),
    },
  ];
}

export default function AICopilot({
  products = [],
  sales = [],
  showSuggestions = true,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [feedback, setFeedback] = useState({});
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState(() => {
    const savedVersion = localStorage.getItem(CHAT_VERSION_KEY);
    const saved = localStorage.getItem(STORAGE_KEY);
    const starter = getStarterMessage();

    if (savedVersion !== CHAT_VERSION) {
      localStorage.setItem(CHAT_VERSION_KEY, CHAT_VERSION);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(starter));
      return starter;
    }

    return saved ? JSON.parse(saved) : starter;
  });

  const messagesEndRef = useRef(null);

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
  const regenerateMessage = async (messageIndex) => {
  if (loading) return;

  const previousUserMessage = [...messages]
    .slice(0, messageIndex)
    .reverse()
    .find((message) => message.role === "user");

  if (!previousUserMessage) return;

  setLoading(true);

  try {
    const aiResponse = await askCopilot({
      message: previousUserMessage.text,
      products,
      sales,
    });

    const regeneratedMessage = {
      id: crypto.randomUUID(),
      role: "ai",
      text: aiResponse || "I could not regenerate the response right now.",
      time: getTime(),
    };

    setMessages((prev) =>
      prev.map((message, index) =>
        index === messageIndex ? regeneratedMessage : message
      )
    );
  } catch (error) {
    console.error("Regenerate error:", error);
  } finally {
    setLoading(false);
  }
};

const handleFeedback = (messageId, type) => {
  setFeedback((prev) => ({
    ...prev,
    [messageId]: prev[messageId] === type ? null : type,
  }));
};

  const clearChat = () => {
    const starter = getStarterMessage();
    setMessages(starter);
    localStorage.setItem(CHAT_VERSION_KEY, CHAT_VERSION);
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
        className={`ai-copilot-button ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open AI Copilot"
      >
        {isOpen ? <FiX /> : "✦"}
        <span>AI</span>
      </button>

      {isOpen && (
        <div className="ai-copilot-backdrop">
          <section className="ai-copilot-window ai-copilot-v5">
            <header className="ai-copilot-header">
              <div className="ai-brand">
                <div className="ai-orb">✦</div>

                <div>
                  <h3>SmartStock AI</h3>
                  <p>Enterprise Inventory Intelligence</p>
                </div>
              </div>

              <div className="ai-copilot-status">
                <span></span>
                Online
              </div>
            </header>

            <main className="ai-copilot-messages">
              {showSuggestions && messages.length <= 1 && (
  <div className="ai-suggestions">
                  {suggestedPrompts.map((prompt) => (
                    <button key={prompt} onClick={() => sendMessage(prompt)}>
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`ai-message ${
                    message.role === "user" ? "user-message" : "bot-message"
                  }`}
                >
                  <div className="ai-message-meta">
  <div className="message-author">
    <span className="message-avatar">
      {message.role === "user" ? "A" : "✦"}
    </span>

    <strong>
      {message.role === "user" ? "You" : "SmartStock AI"}
    </strong>
  </div>

  <span>{message.time}</span>
</div>

                  <div className="ai-message-content">
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  </div>

                {message.role === "ai" && (
  <div className="ai-message-actions">
    <button
      className="ai-message-action-btn"
      onClick={() => copyMessage(message)}
      title="Copy response"
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

    {index > 0 && (
      <button
        className="ai-message-action-btn"
        onClick={() => regenerateMessage(index)}
        disabled={loading}
        title="Regenerate response"
      >
        <FiRefreshCw />
        Regenerate
      </button>
    )}

    <button
      className={`ai-feedback-btn ${
        feedback[message.id] === "helpful" ? "active" : ""
      }`}
      onClick={() => handleFeedback(message.id, "helpful")}
      title="Helpful"
    >
      <FiThumbsUp />
    </button>

    <button
      className={`ai-feedback-btn ${
        feedback[message.id] === "not-helpful" ? "active negative" : ""
      }`}
      onClick={() => handleFeedback(message.id, "not-helpful")}
      title="Not helpful"
    >
      <FiThumbsDown />
    </button>
  </div>
)}
                </div>
              ))}

              {loading && (
  <div className="ai-message bot-message ai-thinking-card">
    <div className="thinking-header">
      <div className="thinking-orb">✦</div>
      <div>
        <strong>SmartStock AI is thinking</strong>
        <span>Analyzing inventory signals...</span>
      </div>
    </div>

    <div className="thinking-steps">
      <p>Scanning stock levels</p>
      <p>Checking sales movement</p>
      <p>Finding revenue opportunities</p>
    </div>

    <div className="thinking-loader">
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
                <span className="ai-input-icon">✨</span>

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