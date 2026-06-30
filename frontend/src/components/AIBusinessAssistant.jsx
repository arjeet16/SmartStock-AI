import { useState } from "react";
import AIReport from "./AIReport";
import { generateAIReport } from "../services/aiService";

function AIBusinessAssistant({
  products,
  sales,
  totalRevenue,
  totalProfit,
  lowStockCount,
  bestSellingProduct,
}) {
  const [aiReport, setAiReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    setLoading(true);
    setAiReport(null);

    try {
      const report = await generateAIReport({
        products,
        sales,
        totalRevenue,
        totalProfit,
        lowStockCount,
        bestSellingProduct,
      });

      setAiReport(report);
    } catch (error) {
      alert("Failed to generate AI report. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-business-assistant">
      <div className="assistant-header">
        <div>
          <p className="assistant-badge">Real AI Powered</p>
          <h2>🤖 SmartStock AI Assistant</h2>
          <p>
            Generate a professional business report using your live inventory
            and sales data.
          </p>
        </div>

        <button
          className="generate-report-btn"
          onClick={generateReport}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "✨ Generate AI Report"}
        </button>
      </div>

      {loading && (
        <div className="ai-loading">
          🤖 AI is analyzing your business data...
        </div>
      )}

      <AIReport report={aiReport} />
    </div>
  );
}

export default AIBusinessAssistant;