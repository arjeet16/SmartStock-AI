import "./App.css";
import "./styles/analytics.css";
import "./styles/simulator.css";
import "./styles/responsive.css";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import Login from "./Login";
import SidebarV2 from "./components/SidebarV2";
import Topbar from "./components/Topbar";
import SearchBar from "./components/SearchBar";
import ProductForm from "./components/ProductForm";
import ProductTable from "./components/ProductTable";
import SalesHistory from "./components/SalesHistory";
import AIInsights from "./components/AIInsights";
import AIRecommendation from "./components/AIRecommendation";
import AIBusinessAssistant from "./components/AIBusinessAssistant";
import ExecutiveHero from "./components/ExecutiveHero";
import ExecutiveBrief from "./components/ExecutiveBrief";
import AnalyticsV2 from "./components/AnalyticsV2";
import AIReport from "./components/AIReport";
import AICopilot from "./components/AICopilot";
import DemandForecast from "./components/DemandForecast";
import MLModelMetrics from "./components/MLModelMetrics";
import ScenarioSimulator from "./components/ScenarioSimulator";
import SmartAlerts from "./components/SmartAlerts";
import AIDecisionPanel from "./components/AIDecisionPanel";
import AIPurchaseAdvisor from "./components/AIPurchaseAdvisor";
import ReportsPage from "./components/ReportsPage";
import DashboardSkeleton from "./components/DashboardSkeleton";

import SettingsPage, {
  DEFAULT_SETTINGS,
} from "./components/SettingsPage";

import { generatePurchaseAdvice } from "./utils/purchaseAdvisor";
import { exportDashboardPDF } from "./utils/exportPDF";
import { generateAIReport } from "./services/aiService";
import { authFetch } from "./services/authFetch";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const EMPTY_FORM = {
  item_name: "",
  category: "",
  quantity: "",
  units_per_carton: "1",
  buying_price: "",
  selling_price: "",
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return (
      localStorage.getItem("smartstock_is_logged_in") === "true"
    );
  });

  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [forecastData, setForecastData] = useState([]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("");

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);

  const [aiReport, setAiReport] = useState(null);
  const [isGeneratingReport, setIsGeneratingReport] =
    useState(false);

  const [isDashboardLoading, setIsDashboardLoading] =
    useState(true);

  const [activeSection, setActiveSection] =
    useState("dashboard");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [sellTarget, setSellTarget] = useState(null);
  const [sellQuantity, setSellQuantity] = useState("");

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

  const clearAuthentication = () => {
    localStorage.removeItem("smartstock_auth_token");
    localStorage.removeItem("smartstock_is_logged_in");
    localStorage.removeItem("smartstock_current_user");

    sessionStorage.removeItem("smartstock_auth_token");
    sessionStorage.removeItem("smartstock_is_logged_in");
    sessionStorage.removeItem("smartstock_current_user");

    setProducts([]);
    setSales([]);
    setForecastData([]);
    setAiReport(null);
    setIsLoggedIn(false);
    setIsDashboardLoading(false);
  };

  const handleLogout = () => {
    clearAuthentication();

    toast.dismiss();
    toast.success("Logged out successfully.", {
      id: "smartstock-logout",
    });
  };

  const fetchProducts = async () => {
    try {
      const data = await authFetch("/products");

      setProducts(Array.isArray(data) ? data : []);

      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Products fetch error:", error);
      setProducts([]);
      throw error;
    }
  };

  const fetchSales = async () => {
    try {
      const data = await authFetch("/sales");

      setSales(Array.isArray(data) ? data : []);

      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Sales fetch error:", error);
      setSales([]);
      throw error;
    }
  };

  const refreshDashboardData = async () => {
    await Promise.all([
      fetchProducts(),
      fetchSales(),
    ]);
  };

  useEffect(() => {
    if (!isLoggedIn) {
      setIsDashboardLoading(false);
      return;
    }

    let isMounted = true;

    const loadDashboardData = async () => {
      try {
        setIsDashboardLoading(true);
        await refreshDashboardData();
      } catch (error) {
        console.error(
          "Dashboard loading error:",
          error
        );
      } finally {
        if (isMounted) {
          setIsDashboardLoading(false);
        }
      }
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem(
      "smartstock_app_settings",
      JSON.stringify(settings)
    );
  }, [settings]);

  useEffect(() => {
    document.body.classList.toggle(
      "smartstock-compact-mode",
      Boolean(settings.compactMode)
    );

    return () => {
      document.body.classList.remove(
        "smartstock-compact-mode"
      );
    };
  }, [settings.compactMode]);

  useEffect(() => {
    const handleUnauthorized = () => {
      clearAuthentication();

      toast.error(
        "Your session has expired. Please log in again.",
        {
          id: "smartstock-session-expired",
        }
      );
    };

    window.addEventListener(
      "smartstock:unauthorized",
      handleUnauthorized
    );

    return () => {
      window.removeEventListener(
        "smartstock:unauthorized",
        handleUnauthorized
      );
    };
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      return undefined;
    }

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

    if (!sections.length) {
      return undefined;
    }

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

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
    };
  }, [isLoggedIn]);

  const handleSidebarNavigation = (sectionId) => {
    const target = document.getElementById(sectionId);

    if (!target) {
      return;
    }

    setActiveSection(sectionId);

    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const resetProductForm = () => {
    setFormData(EMPTY_FORM);
    setEditId(null);
  };

  const addProduct = async (event) => {
    event.preventDefault();

    const productPayload = {
      item_name: formData.item_name.trim(),
      category: formData.category.trim(),
      quantity: Number(formData.quantity),
      units_per_carton:
        Number(formData.units_per_carton) || 1,
      buying_price: Number(formData.buying_price),
      selling_price: Number(formData.selling_price),
    };

    if (
      !productPayload.item_name ||
      !productPayload.category
    ) {
      toast.error(
        "Product name and category are required."
      );
      return;
    }

    if (
      !Number.isFinite(productPayload.quantity) ||
      productPayload.quantity < 0
    ) {
      toast.error("Enter a valid product quantity.");
      return;
    }

    if (
      !Number.isFinite(productPayload.buying_price) ||
      productPayload.buying_price < 0 ||
      !Number.isFinite(productPayload.selling_price) ||
      productPayload.selling_price < 0
    ) {
      toast.error("Enter valid buying and selling prices.");
      return;
    }

    try {
      if (editId) {
        await authFetch(`/products/${editId}`, {
          method: "PUT",
          body: JSON.stringify(productPayload),
        });

        toast.success("Product updated successfully.");
      } else {
        await authFetch("/products", {
          method: "POST",
          body: JSON.stringify(productPayload),
        });

        toast.success("Product added successfully.");
      }

      resetProductForm();
      await refreshDashboardData();
    } catch (error) {
      console.error("Save product error:", error);

      toast.error(
        error.message || "Unable to save product."
      );
    }
  };

  const editProduct = (item) => {
    setEditId(item.id);

    setFormData({
      item_name: item.item_name || "",
      category: item.category || "",
      quantity: String(item.quantity ?? ""),
      units_per_carton: String(
        item.units_per_carton ?? 1
      ),
      buying_price: String(item.buying_price ?? ""),
      selling_price: String(item.selling_price ?? ""),
    });

    const inventorySection =
      document.getElementById("inventory");

    if (inventorySection) {
      inventorySection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const deleteProduct = (id) => {
    const product = products.find(
      (item) => Number(item.id) === Number(id)
    );

    if (!product) {
      toast.error("Product not found.");
      return;
    }

    setDeleteTarget(product);
  };

  const confirmDeleteProduct = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      await authFetch(
        `/products/${deleteTarget.id}`,
        {
          method: "DELETE",
        }
      );

      toast.success(
        `${deleteTarget.item_name} deleted successfully.`
      );

      setDeleteTarget(null);
      await refreshDashboardData();
    } catch (error) {
      console.error("Delete product error:", error);

      toast.error(
        error.message || "Failed to delete product."
      );
    }
  };

  const sellProduct = (productId) => {
    const product = products.find(
      (item) =>
        Number(item.id) === Number(productId)
    );

    if (!product) {
      toast.error("Product not found.");
      return;
    }

    setSellTarget(product);
    setSellQuantity("");
  };

  const confirmSellProduct = async () => {
    if (!sellTarget) {
      return;
    }

    const quantity = Number(sellQuantity);

    if (
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      toast.error(
        "Enter a valid whole-number quantity."
      );
      return;
    }

    if (quantity > Number(sellTarget.quantity)) {
      toast.error(
        `Only ${sellTarget.quantity} units are available.`
      );
      return;
    }

    try {
      await authFetch("/sell", {
        method: "POST",
        body: JSON.stringify({
          product_id: sellTarget.id,
          quantity_sold: quantity,
        }),
      });

      toast.success(
        `${quantity} unit${
          quantity === 1 ? "" : "s"
        } of ${sellTarget.item_name} sold.`
      );

      setSellTarget(null);
      setSellQuantity("");

      await refreshDashboardData();
    } catch (error) {
      console.error("Sell product error:", error);

      toast.error(
        error.message || "Failed to record sale."
      );
    }
  };

  const handleGenerateAIReport = async () => {
    if (isGeneratingReport) {
      return;
    }

    try {
      setIsGeneratingReport(true);

      const report = await generateAIReport({
        products,
        sales,
        totalRevenue,
        totalProfit,
        inventoryValue,
        lowStockCount,
        bestSellingProduct,
        forecastData,
      });

      setAiReport(report);

      toast.success(
        "AI report generated successfully."
      );
    } catch (error) {
      console.error("AI report error:", error);

      toast.error(
        error.message ||
          "Failed to generate AI report."
      );
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleDownloadBusinessPDF = () => {
    try {
      exportDashboardPDF({
        totalRevenue,
        totalProfit,
        inventoryValue,
        lowStockCount,
        bestSellingProduct,
        aiReport,
      });
    } catch (error) {
      console.error("PDF download error:", error);
      toast.error("Unable to download the PDF.");
    }
  };

  const handleViewFinancialSummary = () => {
    const dashboardSection =
      document.getElementById("dashboard");

    if (!dashboardSection) {
      return;
    }

    setActiveSection("dashboard");

    dashboardSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const exportToExcel = () => {
    try {
      if (!products.length) {
        toast.error(
          "There are no products to export."
        );
        return;
      }

      const exportData = products.map((product) => ({
        ID: product.id,
        Product: product.item_name,
        Category: product.category,
        Quantity: Number(product.quantity),
        "Units Per Carton": Number(
          product.units_per_carton || 1
        ),
        "Buying Price": Number(
          product.buying_price
        ),
        "Selling Price": Number(
          product.selling_price
        ),
        "Stock Value":
          Number(product.quantity) *
          Number(product.buying_price),
      }));

      const worksheet =
        XLSX.utils.json_to_sheet(exportData);

      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Inventory"
      );

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const excelBlob = new Blob(
        [excelBuffer],
        {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        }
      );

      saveAs(
        excelBlob,
        "SmartStock_Inventory_Report.xlsx"
      );

      toast.success(
        "Inventory report downloaded."
      );
    } catch (error) {
      console.error("Excel export error:", error);
      toast.error(
        "Unable to export the inventory report."
      );
    }
  };

  const totalProducts = products.length;

  const totalQuantity = products.reduce(
    (sum, item) =>
      sum + Number(item.quantity || 0),
    0
  );

  const inventoryValue = products.reduce(
    (sum, item) =>
      sum +
      Number(item.quantity || 0) *
        Number(item.buying_price || 0),
    0
  );

  const totalProfit = products.reduce(
    (sum, item) =>
      sum +
      Number(item.quantity || 0) *
        (Number(item.selling_price || 0) -
          Number(item.buying_price || 0)),
    0
  );

  const totalRevenue = sales.reduce(
    (sum, sale) =>
      sum +
      Number(sale.quantity_sold || 0) *
        Number(sale.selling_price || 0),
    0
  );

  const totalSales = sales.reduce(
    (sum, sale) =>
      sum + Number(sale.quantity_sold || 0),
    0
  );

  const bestSellingProduct =
    sales.length > 0
      ? sales.reduce((best, current) =>
          Number(current.quantity_sold) >
          Number(best.quantity_sold)
            ? current
            : best
        ).item_name
      : "No Sales";

  const lowStockCount = products.filter(
    (item) =>
      Number(item.quantity || 0) <
      Number(settings.lowStockThreshold || 20)
  ).length;

  const categoryNames = products
    .map((item) => String(item.category || "").trim())
    .filter(Boolean);

  const categories = [
    "All",
    ...new Set(categoryNames),
  ];

  const filteredProducts = products
    .filter((item) => {
      const itemName = String(
        item.item_name || ""
      ).toLowerCase();

      const itemCategory = String(
        item.category || ""
      ).toLowerCase();

      const searchValue =
        search.trim().toLowerCase();

      const matchesSearch =
        itemName.includes(searchValue) ||
        itemCategory.includes(searchValue);

      const matchesCategory =
        categoryFilter === "All" ||
        item.category === categoryFilter;

      return matchesSearch && matchesCategory;
    })
    .sort((firstProduct, secondProduct) => {
      if (sortBy === "name") {
        return String(
          firstProduct.item_name || ""
        ).localeCompare(
          String(secondProduct.item_name || "")
        );
      }

      if (sortBy === "quantity") {
        return (
          Number(secondProduct.quantity || 0) -
          Number(firstProduct.quantity || 0)
        );
      }

      if (sortBy === "profit") {
        const firstProfit =
          Number(firstProduct.selling_price || 0) -
          Number(firstProduct.buying_price || 0);

        const secondProfit =
          Number(secondProduct.selling_price || 0) -
          Number(secondProduct.buying_price || 0);

        return secondProfit - firstProfit;
      }

      return 0;
    });

  const barChartData = {
    labels: products.map(
      (item) => item.item_name
    ),
    datasets: [
      {
        label: "Quantity",
        data: products.map((item) =>
          Number(item.quantity || 0)
        ),
        backgroundColor: "#3498db",
      },
    ],
  };

  const uniqueCategories = [
    ...new Set(categoryNames),
  ];

  const pieChartData = {
    labels: uniqueCategories,
    datasets: [
      {
        data: uniqueCategories.map(
          (category) =>
            products.filter(
              (item) =>
                item.category === category
            ).length
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

  const purchaseAdvice =
    generatePurchaseAdvice(
      products,
      forecastData
    ) || {};

  const purchaseDecisions = Array.isArray(
    purchaseAdvice.decisions
  )
    ? purchaseAdvice.decisions
    : [];

  const topRecommendation =
    purchaseDecisions.find(
      (item) =>
        Number(item.recommendedPurchase) > 0
    ) || null;

  if (!isLoggedIn) {
    return (
      <Login setIsLoggedIn={setIsLoggedIn} />
    );
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

        <div
          id="dashboard"
          className="dashboard-anchor-section"
        >
          <ExecutiveHero
            products={products}
            sales={sales}
            totalRevenue={totalRevenue}
            totalProfit={totalProfit}
            inventoryValue={inventoryValue}
            lowStockCount={lowStockCount}
            bestSellingProduct={
              bestSellingProduct
            }
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
            topRecommendation={
              topRecommendation
            }
          />

          <AnalyticsV2
            barChartData={barChartData}
            pieChartData={pieChartData}
          />

          <section
            id="forecast"
            className="dashboard-anchor-section"
          >
            <DemandForecast
              onForecastLoad={setForecastData}
            />
          </section>

          {settings.stockAlerts && (
            <section
              id="alerts"
              className="dashboard-anchor-section"
            >
              <SmartAlerts
                forecastData={forecastData}
              />
            </section>
          )}

          <section
            id="simulator"
            className="dashboard-anchor-section"
          >
            <ScenarioSimulator
              forecast={forecastData}
            />
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

        <div
          id="ai"
          className="dashboard-anchor-section"
        >
          <AIBusinessAssistant
            products={products}
            sales={sales}
            totalRevenue={totalRevenue}
            totalProfit={totalProfit}
            lowStockCount={lowStockCount}
            bestSellingProduct={
              bestSellingProduct
            }
          />

          <AIInsights
            products={products}
            sales={sales}
            lowStockCount={lowStockCount}
            totalRevenue={totalRevenue}
            totalProfit={totalProfit}
          />

          <AIRecommendation
            products={products}
            sales={sales}
          />
        </div>

        <div
          id="inventory"
          className="dashboard-anchor-section"
        >
          <SearchBar
            search={search}
            setSearch={setSearch}
            categories={categories}
            categoryFilter={categoryFilter}
            setCategoryFilter={
              setCategoryFilter
            }
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
            filteredProducts={
              filteredProducts
            }
            editProduct={editProduct}
            sellProduct={sellProduct}
            deleteProduct={deleteProduct}
          />
        </div>

        <div
          id="sales"
          className="dashboard-anchor-section"
        >
          <SalesHistory sales={sales} />
        </div>

        <div
          id="reports"
          className="dashboard-anchor-section"
        >
          <ReportsPage
            totalRevenue={totalRevenue}
            totalProfit={totalProfit}
            inventoryValue={inventoryValue}
            lowStockCount={lowStockCount}
            bestSellingProduct={
              bestSellingProduct
            }
            exportToExcel={exportToExcel}
            onGenerateAIReport={
              handleGenerateAIReport
            }
            onDownloadPDF={
              handleDownloadBusinessPDF
            }
            onViewSummary={
              handleViewFinancialSummary
            }
            isGeneratingReport={
              isGeneratingReport
            }
          />
        </div>

        <div
          id="settings"
          className="dashboard-anchor-section"
        >
          <SettingsPage
            settings={settings}
            setSettings={setSettings}
          />
        </div>

        {deleteTarget && (
          <div
            className="smartstock-modal-backdrop"
            onMouseDown={() =>
              setDeleteTarget(null)
            }
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

              <h3>
                Delete{" "}
                {deleteTarget.item_name}?
              </h3>

              <p>
                This product will be removed
                permanently. This action cannot be
                undone.
              </p>

              <div className="smartstock-modal-actions">
                <button
                  type="button"
                  className="smartstock-modal-cancel"
                  onClick={() =>
                    setDeleteTarget(null)
                  }
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="smartstock-modal-delete"
                  onClick={
                    confirmDeleteProduct
                  }
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

              <h3>
                Sell {sellTarget.item_name}
              </h3>

              <p>
                Available stock:{" "}
                <strong>
                  {sellTarget.quantity} units
                </strong>
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
                    setSellQuantity(
                      event.target.value
                    )
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
                  onClick={
                    confirmSellProduct
                  }
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
          bestSellingProduct={
            bestSellingProduct
          }
          showSuggestions={
            settings.aiSuggestions
          }
        />
      </div>
    </>
  );
}

export default App;