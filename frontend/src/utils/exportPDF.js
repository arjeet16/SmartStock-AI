import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportDashboardPDF(data) {
  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.setTextColor(37, 99, 235);
  doc.text("SmartStock AI", 20, 20);

  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text("Inventory Intelligence Platform", 20, 28);

  doc.setDrawColor(220);
  doc.line(20, 34, 190, 34);

  doc.setFontSize(16);
  doc.setTextColor(0);
  doc.text("Business Summary", 20, 45);

  autoTable(doc, {
    startY: 55,
    head: [["Metric", "Value"]],
    body: [
      ["Revenue", `₹${data.totalRevenue}`],
      ["Profit", `₹${data.totalProfit}`],
      ["Inventory Value", `₹${data.inventoryValue}`],
      ["Low Stock Items", data.lowStockCount],
      ["Best Selling Product", data.bestSellingProduct],
    ],
    theme: "grid",
    headStyles: {
      fillColor: [37, 99, 235],
    },
  });

  const finalY = doc.lastAutoTable.finalY + 15;

  doc.setFontSize(16);
  doc.text("AI Business Report", 20, finalY);

  doc.setFontSize(11);
  doc.setTextColor(80);

  const report = doc.splitTextToSize(
    data.aiReport || "No AI report available.",
    170
  );

  doc.text(report, 20, finalY + 10);

  doc.save("SmartStock_Report.pdf");
}