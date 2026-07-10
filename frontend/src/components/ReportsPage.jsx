import {
  FaBrain,
  FaChartLine,
  FaDownload,
  FaFileExcel,
  FaFilePdf,
} from "react-icons/fa";

function ReportsPage({
  totalRevenue,
  totalProfit,
  inventoryValue,
  lowStockCount,
  bestSellingProduct,
  exportToExcel,
  onGenerateAIReport,
  onDownloadPDF,
  onViewSummary,
  isGeneratingReport = false,
}) {
  const reportCards = [
    {
      title: "Executive AI Report",
      description:
        "Generate a management-ready summary of revenue, profit, stock risk and recommended actions.",
      icon: <FaBrain />,
      action: isGeneratingReport ? "Generating..." : "Generate Report",
      onClick: onGenerateAIReport,
      disabled: isGeneratingReport,
    },
    {
      title: "Inventory Report",
      description:
        "Download current products, stock levels, pricing and category information.",
      icon: <FaFileExcel />,
      action: "Export Excel",
      onClick: exportToExcel,
      disabled: false,
    },
    {
      title: "Financial Summary",
      description:
        "Review revenue, estimated profit, inventory value and business performance.",
      icon: <FaChartLine />,
      action: "View Summary",
      onClick: onViewSummary,
      disabled: false,
    },
    {
      title: "PDF Business Report",
      description:
        "Create a polished document suitable for meetings, demos and portfolio presentation.",
      icon: <FaFilePdf />,
      action: "Download PDF",
      onClick: onDownloadPDF,
      disabled: false,
    },
  ];

  return (
    <section className="reports-page">
      <div className="reports-header">
        <div>
          <span>BUSINESS INTELLIGENCE</span>
          <h2>Reports & Export Center</h2>
          <p>
            Generate executive insights and export live inventory,
            financial and AI analysis.
          </p>
        </div>

        <button
          type="button"
          className="reports-primary-btn"
          onClick={exportToExcel}
        >
          <FaDownload />
          Export Inventory
        </button>
      </div>

      <div className="reports-summary-grid">
        <div>
          <span>Revenue</span>
          <strong>₹{Number(totalRevenue).toLocaleString("en-IN")}</strong>
        </div>

        <div>
          <span>Profit</span>
          <strong>₹{Number(totalProfit).toLocaleString("en-IN")}</strong>
        </div>

        <div>
          <span>Inventory Value</span>
          <strong>₹{Number(inventoryValue).toLocaleString("en-IN")}</strong>
        </div>

        <div>
          <span>Low Stock</span>
          <strong>{lowStockCount}</strong>
        </div>

        <div>
          <span>Best Seller</span>
          <strong>{bestSellingProduct || "No Sales"}</strong>
        </div>
      </div>

      <div className="reports-card-grid">
        {reportCards.map((report) => (
          <article className="report-action-card" key={report.title}>
            <div className="report-action-icon">{report.icon}</div>

            <h3>{report.title}</h3>
            <p>{report.description}</p>

            <button
              type="button"
              onClick={report.onClick}
              disabled={report.disabled || !report.onClick}
            >
              {report.action}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ReportsPage;