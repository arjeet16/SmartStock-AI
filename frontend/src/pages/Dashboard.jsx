import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import SidebarV2 from "../components/SidebarV2";
import Topbar from "../components/Topbar";
import CEOHero from "../components/CEOHero";
import KPICardsV2 from "../components/KPICardsV2";
import AnalyticsV2 from "../components/AnalyticsV2";
import AIBusinessAssistant from "../components/AIBusinessAssistant";
import AIInsights from "../components/AIInsights";
import AIRecommendation from "../components/AIRecommendation";
import SearchBar from "../components/SearchBar";
import ProductForm from "../components/ProductForm";
import ProductTable from "../components/ProductTable";
import SalesHistory from "../components/SalesHistory";
import AIReport from "../components/AIReport";

import { useDashboardData } from "../hooks/useDashboardData";

import {
  fetchProducts,
  fetchSales,
  createProduct,
  updateProduct,
  removeProduct,
  sellProductAPI,
} from "../services/apiService";

function Dashboard({ handleLogout }) {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("");
  const [editId, setEditId] = useState(null);
  const [aiReport, setAiReport] = useState(null);

  const [formData, setFormData] = useState({
    item_name: "",
    category: "",
    quantity: "",
    buying_price: "",
    selling_price: "",
  });

  const {
    totalRevenue,
    totalProfit,
    inventoryValue,
    lowStockCount,
    totalProducts,
    totalQuantity,
    bestSellingProduct,
  } = useDashboardData(products, sales);

  const totalSales = sales.reduce(
    (sum, sale) => sum + Number(sale.quantity_sold || 0),
    0
  );

  const loadProducts = async () => {
    const data = await fetchProducts();
    setProducts(data);
  };

  const loadSales = async () => {
    const data = await fetchSales();
    setSales(data);
  };

  useEffect(() => {
    loadProducts();
    loadSales();
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
      await updateProduct(editId, formData);
      setEditId(null);
    } else {
      await createProduct(formData);
    }

    await loadProducts();
    await loadSales();

    setFormData({
      item_name: "",
      category: "",
      quantity: "",
      buying_price: "",
      selling_price: "",
    });
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    await removeProduct(id);
    await loadProducts();
    await loadSales();
  };

  const sellProduct = async (productId) => {
    const quantity = prompt("Enter quantity to sell:");
    if (!quantity || Number(quantity) <= 0) return;

    await sellProductAPI(productId, Number(quantity));
    await loadProducts();
    await loadSales();
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

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(products);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(data, "Inventory_Report.xlsx");
  };

  const categories = ["All", ...new Set(products.map((item) => item.category))];

  const filteredProducts = products
    .filter((item) => {
      const matchesSearch =
        item.item_name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "All" || item.category === categoryFilter;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.item_name.localeCompare(b.item_name);
      if (sortBy === "quantity") return b.quantity - a.quantity;
      if (sortBy === "profit") {
        const profitA = a.selling_price - a.buying_price;
        const profitB = b.selling_price - b.buying_price;
        return profitB - profitA;
      }
      return 0;
    });

  const barChartData = {
    labels: products.map((item) => item.item_name),
    datasets: [
      {
        label: "Quantity",
        data: products.map((item) => item.quantity),
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
            products.filter((item) => item.category === category).length
        ),
        backgroundColor: ["#3498db", "#2ecc71", "#f39c12", "#e74c3c"],
      },
    ],
  };

  return (
    <>
      <SidebarV2 />

      <div className="container">
        <Topbar handleLogout={handleLogout} />

        <div id="dashboard">
          <CEOHero
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

          {aiReport && <AIReport report={aiReport} />}

          <KPICardsV2
            totalRevenue={totalRevenue}
            totalProfit={totalProfit}
            totalProducts={totalProducts}
            totalSales={totalSales}
            inventoryValue={inventoryValue}
            lowStockCount={lowStockCount}
          />

          <AnalyticsV2
            barChartData={barChartData}
            pieChartData={pieChartData}
          />
        </div>

        <div id="ai">
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

        <div id="inventory">
          <SearchBar
            search={search}
            setSearch={setSearch}
            categories={categories}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />

          <button className="export-btn" onClick={exportToExcel}>
            📥 Export Inventory to Excel
          </button>

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

        <div id="sales">
          <SalesHistory sales={sales} />
        </div>

        <div id="reports" className="placeholder-section">
          <h2>📄 Reports</h2>
          <p>AI reports and export tools will appear here.</p>
        </div>

        <div id="settings" className="placeholder-section">
          <h2>⚙️ Settings</h2>
          <p>Profile, preferences and system settings will appear here.</p>
        </div>
      </div>
    </>
  );
}

export default Dashboard;