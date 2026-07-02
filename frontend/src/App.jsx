import "./App.css";
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
import CEOHero from "./components/CEOHero";
import AnalyticsV2 from "./components/AnalyticsV2";
import AIReport from "./components/AIReport";
import AICopilot from "./components/AICopilot";
import DemandForecast from "./components/DemandForecast";
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    setIsLoggedIn(false);
  };

  const fetchProducts = () => {
    fetch("http://localhost:5000/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  };

  const fetchSales = () => {
    fetch("http://localhost:5000/sales")
      .then((res) => res.json())
      .then((data) => setSales(data));
  };

  useEffect(() => {
    fetchProducts();
    fetchSales();
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
      await fetch(`http://localhost:5000/products/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      setEditId(null);
    } else {
      await fetch("http://localhost:5000/products", {
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

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    await fetch(`http://localhost:5000/products/${id}`, {
      method: "DELETE",
    });

    fetchProducts();
    fetchSales();
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(products);
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

    const data = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(data, "Inventory_Report.xlsx");
  };

  const sellProduct = async (productId) => {
    const quantity = prompt("Enter quantity to sell:");

    if (!quantity || Number(quantity) <= 0) return;

    await fetch("http://localhost:5000/sell", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: productId,
        quantity_sold: Number(quantity),
      }),
    });

    fetchProducts();
    fetchSales();
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
    (item) => Number(item.quantity) < 10
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

  if (!isLoggedIn) {
    return <Login setIsLoggedIn={setIsLoggedIn} />;
  }

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
  {/* <DashboardV2
  totalRevenue={totalRevenue}
  totalProfit={totalProfit}
  totalProducts={totalProducts}
  lowStockCount={lowStockCount}
  bestSellingProduct={bestSellingProduct}
/> */}


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
<DemandForecast />
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

        <AIRecommendation
          products={products}
          sales={sales}
        />
      </div>

      Inventory 
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

       Sales 
      <div id="sales">
        <SalesHistory sales={sales} />
      </div>
      {/* Reports */}
<div id="reports">
  <div className="placeholder-section">
    <h2>📄 Reports</h2>
    <p>AI reports and export tools will appear here.</p>
  </div>
</div>

{/* Settings */}
<div id="settings">
  <div className="placeholder-section">
    <h2>⚙️ Settings</h2>
    <p>Profile, preferences and system settings will appear here.</p>
  </div>
</div>

<AICopilot
  products={products}
  sales={sales}
  totalRevenue={totalRevenue}
  totalProfit={totalProfit}
  lowStockCount={lowStockCount}
  bestSellingProduct={bestSellingProduct}
/>

</div>
</>
);
}
export default App;
