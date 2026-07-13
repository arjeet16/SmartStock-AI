import "./App.css";
import "./styles/analytics.css";
import "./styles/simulator.css";
import "./styles/responsive.css";
import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import StatsCards from "./components/StatsCards";
import Charts from "./components/Charts";
import Login from "./Login";
import SearchBar from "./components/SearchBar";
import ProductForm from "./components/ProductForm";
import ProductTable from "./components/ProductTable";
import SalesHistory from "./components/SalesHistory";
import AIInsights from "./components/AIInsights";
import AIRecommendation from "./components/AIRecommendation";
import AIBusinessAssistant from "./components/AIBusinessAssistant";
import DashboardV2 from "./components/DashboardV2";
import SidebarV2 from "./components/SidebarV2";
import Topbar from "./components/Topbar";
import KPICardsV2 from "./components/KPICardsV2";
import ExecutiveHero from "./components/ExecutiveHero";
import AnalyticsV2 from "./components/AnalyticsV2";
import AIReport from "./components/AIReport";
import AICopilot from "./components/AICopilot";
import DemandForecast from "./components/DemandForecast";
import MLModelMetrics from "./components/MLModelMetrics";
import ScenarioSimulator from "./components/ScenarioSimulator";
import { API_BASE_URL } from "./services/api";
import ExecutiveBrief from "./components/ExecutiveBrief";
import SmartAlerts from "./components/SmartAlerts";
import AIDecisionPanel from "./components/AIDecisionPanel";
import AIPurchaseAdvisor from "./components/AIPurchaseAdvisor";
import { generatePurchaseAdvice } from "./utils/purchaseAdvisor";
import SettingsPage, {
  DEFAULT_SETTINGS,
} from "./components/SettingsPage";
import ReportsPage from "./components/ReportsPage";
import ReportsHistory from "./components/ReportsHistory";
import { generateAIReport } from "./services/aiService";
import { exportDashboardPDF } from "./utils/exportPDF";
import toast from "react-hot-toast";
import DashboardSkeleton from "./components/DashboardSkeleton";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import {
  FaSearch,
  FaShoppingCart,
  FaTrash,
} from "react-icons/fa";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
  return localStorage.getItem("smartstock_is_logged_in") === "true";
});
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [forecastData, setForecastData] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("");
  const [editId, setEditId] = useState(null);
  const [aiReport, setAiReport] = useState(null);
  const [reportHistory, setReportHistory] = useState([]);
  const [isDashboardLoading, setIsDashboardLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

const [sellTarget, setSellTarget] = useState(null);
const [sellQuantity, setSellQuantity] = useState("");
  const [formData, setFormData] = useState({
    item_name: "",
    category: "",
    quantity: "",
    buying_price: "",
    selling_price: "",
  });
  const deleteReport = (id) => {
  setReportHistory((prev) =>
    prev.filter((reportItem) => reportItem.id !== id)
  );
};
  const handleGenerateAIReport = async () => {
  if (isGeneratingReport) return;

  try {
    setIsGeneratingReport(true);
  
    const report = await generateAIReport({
      products,
      sales,
      totalRevenue,
      totalProfit,
      lowStockCount,
      bestSellingProduct,
    });

    
    setReportHistory((prev) => [
  {
    id: crypto.randomUUID(),
    title: "Executive AI Report",
    date: new Date().toLocaleString(),
    report,
  },
  ...prev,
]);
    toast.success("AI Report Generated Successfully!");
  } catch (error) {
    console.error("AI report error:", error);
    toast.error("Failed to generate AI report.");
  } finally {
    setIsGeneratingReport(false);
  }
};

const handleDownloadBusinessPDF = () => {
  exportDashboardPDF({
    totalRevenue,
    totalProfit,
    inventoryValue,
    lowStockCount,
    bestSellingProduct,
    aiReport,
  });
};

const handleViewFinancialSummary = () => {
  const dashboardSection = document.getElementById("dashboard");

  if (!dashboardSection) return;

  setActiveSection("dashboard");

  dashboardSection.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};
  const [activeSection, setActiveSection] = useState("dashboard");
const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [settings, setSettings] = useState(() => {
  const savedSettings = localStorage.getItem(
    "smartstock_app_settings"
  );

  if (!savedSettings) {
    return DEFAULT_SETTINGS;
  }

  try {
    return {
      ...DEFAULT_SETTINGS,
      ...JSON.parse(savedSettings),
    };
  } catch (error) {
    console.error("Failed to load settings:", error);
    return DEFAULT_SETTINGS;
  }
});

  const handleSidebarNavigation = (sectionId) => {
  const target = document.getElementById(sectionId);

  if (!target) return;

  setActiveSection(sectionId);

  target.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};
  const handleLogout = () => {
  localStorage.removeItem("smartstock_is_logged_in");
  localStorage.removeItem("smartstock_current_user");

  sessionStorage.removeItem("smartstock_is_logged_in");
  sessionStorage.removeItem("smartstock_current_user");

  setIsLoggedIn(false);

  toast.dismiss();
  toast.success("Logged out successfully.", {
    id: "smartstock-logout",
  });
};

const fetchProducts = () => {
  fetch(`${API_BASE_URL}/products`)
    .then((res) => res.json())
    .then((data) => setProducts(data))
    .catch((error) => console.error("Products fetch error:", error));
};

const fetchSales = () => {
  fetch(`${API_BASE_URL}/sales`)
    .then((res) => res.json())
    .then((data) => setSales(data))
    .catch((error) => console.error("Sales fetch error:", error));
};

useEffect(() => {
  const loadDashboardData = async () => {
    try {
      setIsDashboardLoading(true);

      await Promise.all([
        fetch(`${API_BASE_URL}/products`)
          .then((response) => response.json())
          .then((data) => setProducts(data)),

        fetch(`${API_BASE_URL}/sales`)
          .then((response) => response.json())
          .then((data) => setSales(data)),
      ]);
    } catch (error) {
      console.error("Dashboard loading error:", error);
    } finally {
      setIsDashboardLoading(false);
    }
  };

  loadDashboardData();
}, []);

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};

const addProduct = async (e) => {
  e.preventDefault();

  if (editId) {
    await fetch(`${API_BASE_URL}/products/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    setEditId(null);
  } else {
    await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
  }

  fetchProducts();
  fetchSales();

  setFormData({
    item_name: "",
    category: "",
    quantity: "",
    buying_price: "",
    selling_price: "",
  });
};

const deleteProduct = (id) => {
  const product = products.find(
    (item) => Number(item.id) === Number(id)
  );

  if (!product) {
    toast.error("Product not found");
    return;
  }

  setDeleteTarget(product);
};
const confirmDeleteProduct = async () => {
  if (!deleteTarget) return;

  try {
    const response = await fetch(
      `${API_BASE_URL}/products/${deleteTarget.id}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Unable to delete product"
      );
    }

    toast.success(
      `${deleteTarget.item_name} deleted successfully`
    );

    setDeleteTarget(null);

    fetchProducts();
    fetchSales();
  } catch (error) {
    console.error("Delete product error:", error);

    toast.error(
      error.message || "Failed to delete product"
    );
  }
};

const exportToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(products);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const data = new Blob([excelBuffer], {
    type:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });

  saveAs(data, "Inventory_Report.xlsx");
};

const sellProduct = (productId) => {
  const product = products.find(
    (item) => Number(item.id) === Number(productId)
  );

  if (!product) {
    toast.error("Product not found");
    return;
  }

  setSellTarget(product);
  setSellQuantity("");
};
const confirmSellProduct = async () => {
  if (!sellTarget) return;

  const quantity = Number(sellQuantity);

  if (
    !Number.isInteger(quantity) ||
    quantity <= 0
  ) {
    toast.error("Enter a valid whole-number quantity");
    return;
  }

  if (quantity > Number(sellTarget.quantity)) {
    toast.error(
      `Only ${sellTarget.quantity} units are available`
    );
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/sell`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: sellTarget.id,
          quantity_sold: quantity,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Unable to sell product"
      );
    }

    toast.success(
      `${quantity} unit${
        quantity === 1 ? "" : "s"
      } of ${sellTarget.item_name} sold`
    );

    setSellTarget(null);
    setSellQuantity("");

    fetchProducts();
    fetchSales();
  } catch (error) {
    console.error("Sell product error:", error);

    toast.error(
      error.message || "Failed to record sale"
    );
  }
};

  const editProduct = (item) => {
    setEditId(item.id);

    setFormData({
      item_name: item.item_name,
      category: item.category,
      quantity: item.quantity,
      buying_price: item.buying_price,
      selling_price: item.selling_price,
    });
  };

  const totalProducts = products.length;

  const totalQuantity = products.reduce(
    (sum, item) => sum + Number(item.quantity),
    0
  );

  const inventoryValue = products.reduce(
    (sum, item) =>
      sum + Number(item.quantity) * Number(item.buying_price),
    0
  );

  const totalProfit = products.reduce(
    (sum, item) =>
      sum +
      Number(item.quantity) *
        (Number(item.selling_price) -
          Number(item.buying_price)),
    0
  );

  const totalRevenue = sales.reduce(
    (sum, sale) =>
      sum +
      Number(sale.quantity_sold) *
        Number(sale.selling_price),
    0
  );

  const totalSales = sales.reduce(
    (sum, sale) => sum + Number(sale.quantity_sold),
    0
  );

  const bestSellingProduct =
    sales.length > 0
      ? sales.reduce((best, current) =>
          current.quantity_sold > best.quantity_sold
            ? current
            : best
        ).item_name
      : "No Sales";

  const lowStockCount = products.filter(
    (item) =>
      Number(item.quantity) < Number(settings.lowStockThreshold)
  ).length;

  const categories = [
    "All",
    ...new Set(products.map((item) => item.category)),
  ];

  const filteredProducts = products
    .filter((item) => {
      const matchesSearch =
        item.item_name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        item.category
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "All" ||
        item.category === categoryFilter;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.item_name.localeCompare(b.item_name);
      }

      if (sortBy === "quantity") {
        return Number(b.quantity) - Number(a.quantity);
      }

      if (sortBy === "profit") {
        const profitA =
          Number(a.selling_price) - Number(a.buying_price);

        const profitB =
          Number(b.selling_price) - Number(b.buying_price);

        return profitB - profitA;
      }

      return 0;
    });

  const barChartData = {
    labels: products.map((item) => item.item_name),
    datasets: [
      {
        label: "Quantity",
        data: products.map((item) => Number(item.quantity)),
        backgroundColor: "#3498db",
      },
    ],
  };

  const pieChartData = {
    labels: [...new Set(products.map((item) => item.category))],
    datasets: [
      {
        data: [...new Set(products.map((item) => item.category))].map(
          (category) =>
            products.filter((item) => item.category === category)
              .length
        ),
        backgroundColor: [
          "#3498db",
          "#2ecc71",
          "#f39c12",
          "#e74c3c",
          "#9b59b6",
        ],
      },
    ],
  };
  const purchaseAdvice = generatePurchaseAdvice(products, forecastData);

const topRecommendation =
  purchaseAdvice.decisions.find((item) => item.recommendedPurchase > 0) ||
  null;
  useEffect(() => {
    document.body.classList.toggle(
      "smartstock-compact-mode",
      Boolean(settings.compactMode)
    );
  }, [settings.compactMode]);

  useEffect(() => {
    if (!isLoggedIn) return undefined;

    const sectionIds = [
      "dashboard",
      "forecast",
      "alerts",
      "simulator",
      "inventory",
      "sales",
      "ai",
      "reports",
      "settings",
    ];

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (firstEntry, secondEntry) =>
              secondEntry.intersectionRatio -
              firstEntry.intersectionRatio
          )[0];

        if (visibleEntry?.target?.id) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      {
        root: null,
        rootMargin: "-18% 0px -68% 0px",
        threshold: [0.05, 0.15, 0.3],
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [isLoggedIn]);

  if (!isLoggedIn) {
  return <Login setIsLoggedIn={setIsLoggedIn} />;
}
  if (isDashboardLoading) {
  return <DashboardSkeleton />;
}
  return (
  <>
    <SidebarV2
  activeSection={activeSection}
  onNavigate={handleSidebarNavigation}
  userName={settings.profileName}
/>

    <div className="container">
      <Topbar
  handleLogout={handleLogout}
  products={products}
  forecastData={forecastData}
  totalRevenue={totalRevenue}
  totalProfit={totalProfit}
/>

      <div id="dashboard" className="dashboard-anchor-section">
       <ExecutiveHero
  products={products}
  sales={sales}
  totalRevenue={totalRevenue}
  totalProfit={totalProfit}
  inventoryValue={inventoryValue}
  lowStockCount={lowStockCount}
  bestSellingProduct={bestSellingProduct}
  aiReport={aiReport}
  setAiReport={setAiReport}
/>

        <ExecutiveBrief
          totalRevenue={totalRevenue}
          totalProfit={totalProfit}
          inventoryHealth={83}
          businessScore={92}
          businessStatus="Healthy"
          aiConfidence={94}
          topRecommendation={topRecommendation}
        />

        {/* 
<KPICardsV2
  totalRevenue={totalRevenue}
  totalProfit={totalProfit}
  lowStockCount={lowStockCount}
  inventoryValue={inventoryValue}
/> 
*/}

        <AnalyticsV2
          barChartData={barChartData}
          pieChartData={pieChartData}
        />

        <section id="forecast" className="dashboard-anchor-section">
  <DemandForecast onForecastLoad={setForecastData} />
</section>

{settings.stockAlerts && (
  <section id="alerts" className="dashboard-anchor-section">
    <SmartAlerts forecastData={forecastData} />
  </section>
)}

<section id="simulator" className="dashboard-anchor-section">
  <ScenarioSimulator forecast={forecastData} />
</section>

        {forecastData.length > 0 && (
          <>
            <AIDecisionPanel
              forecast={forecastData[0]}
              products={products}
            />

            <AIPurchaseAdvisor
              products={products}
              forecastData={forecastData}
            />
          </>
        )}

        {aiReport && (
          <AIReport
            report={aiReport}
            forecastData={forecastData}
            products={products}
            sales={sales}
            totalRevenue={totalRevenue}
            totalProfit={totalProfit}
            inventoryValue={inventoryValue}
          />
        )}

        <MLModelMetrics />
      </div>

      <div id="ai" className="dashboard-anchor-section">
        <AIBusinessAssistant
          products={products}
          sales={sales}
          totalRevenue={totalRevenue}
          totalProfit={totalProfit}
          lowStockCount={lowStockCount}
          bestSellingProduct={bestSellingProduct}
        />

        <AIInsights
          products={products}
          sales={sales}
          lowStockCount={lowStockCount}
          totalRevenue={totalRevenue}
          totalProfit={totalProfit}
        />

        <AIRecommendation products={products} sales={sales} />
      </div>

      <div id="inventory" className="dashboard-anchor-section">
        <SearchBar
          search={search}
          setSearch={setSearch}
          categories={categories}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        <ProductForm
          formData={formData}
          handleChange={handleChange}
          addProduct={addProduct}
          editId={editId}
        />

        <ProductTable
                    filteredProducts={filteredProducts}
          editProduct={editProduct}
          sellProduct={sellProduct}
          deleteProduct={deleteProduct}
        />
      </div>

      <div id="sales" className="dashboard-anchor-section">
        <SalesHistory sales={sales} />
      </div>

      <div id="reports" className="dashboard-anchor-section">
        <ReportsPage
          totalRevenue={totalRevenue}
          totalProfit={totalProfit}
          inventoryValue={inventoryValue}
          lowStockCount={lowStockCount}
          bestSellingProduct={bestSellingProduct}
          exportToExcel={exportToExcel}
          onGenerateAIReport={handleGenerateAIReport}
          onDownloadPDF={handleDownloadBusinessPDF}
          onViewSummary={handleViewFinancialSummary}
          isGeneratingReport={isGeneratingReport}
        />

        {/*
        <ReportsHistory
          reports={reportHistory}
          deleteReport={deleteReport}
        />
        */}
      </div>

      <div id="settings" className="dashboard-anchor-section">
        <SettingsPage
          settings={settings}
          setSettings={setSettings}
        />
      </div>
      {deleteTarget && (
  <div
    className="smartstock-modal-backdrop"
    onMouseDown={() => setDeleteTarget(null)}
  >
    <div
      className="smartstock-modal"
      onMouseDown={(event) =>
        event.stopPropagation()
      }
    >
      <span className="smartstock-modal-label">
        DELETE PRODUCT
      </span>

      <h3>Delete {deleteTarget.item_name}?</h3>

      <p>
        This product will be removed permanently. This
        action cannot be undone.
      </p>

      <div className="smartstock-modal-actions">
        <button
          type="button"
          className="smartstock-modal-cancel"
          onClick={() => setDeleteTarget(null)}
        >
          Cancel
        </button>

        <button
          type="button"
          className="smartstock-modal-delete"
          onClick={confirmDeleteProduct}
        >
          Delete Product
        </button>
      </div>
    </div>
  </div>
)}

{sellTarget && (
  <div
    className="smartstock-modal-backdrop"
    onMouseDown={() => {
      setSellTarget(null);
      setSellQuantity("");
    }}
  >
    <div
      className="smartstock-modal"
      onMouseDown={(event) =>
        event.stopPropagation()
      }
    >
      <span className="smartstock-modal-label">
        RECORD SALE
      </span>

      <h3>Sell {sellTarget.item_name}</h3>

      <p>
        Available stock:{" "}
        <strong>{sellTarget.quantity} units</strong>
      </p>

      <label className="smartstock-modal-field">
        <span>Quantity to sell</span>

        <input
          type="number"
          min="1"
          max={sellTarget.quantity}
          step="1"
          value={sellQuantity}
          onChange={(event) =>
            setSellQuantity(event.target.value)
          }
          placeholder="Enter quantity"
          autoFocus
        />
      </label>

      <div className="smartstock-modal-actions">
        <button
          type="button"
          className="smartstock-modal-cancel"
          onClick={() => {
            setSellTarget(null);
            setSellQuantity("");
          }}
        >
          Cancel
        </button>

        <button
          type="button"
          className="smartstock-modal-confirm"
          onClick={confirmSellProduct}
        >
          Confirm Sale
        </button>
      </div>
    </div>
  </div>
)}
      <AICopilot
        products={products}
        sales={sales}
        totalRevenue={totalRevenue}
        totalProfit={totalProfit}
        lowStockCount={lowStockCount}
        bestSellingProduct={bestSellingProduct}
        showSuggestions={settings.aiSuggestions}
      />
    </div>
  </>
);
}

export default App;