import "./App.css";
import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import DashboardHeader from "./components/DashboardHeader";
import StatsCards from "./components/StatsCards";
import Charts from "./components/Charts";
import Login from "./Login";

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
      <Sidebar />

      <div className="container">
        <DashboardHeader handleLogout={handleLogout} />

        <StatsCards
          totalProducts={totalProducts}
          totalQuantity={totalQuantity}
          inventoryValue={inventoryValue}
          totalProfit={totalProfit}
          totalRevenue={totalRevenue}
          totalSales={totalSales}
          bestSellingProduct={bestSellingProduct}
          lowStockCount={lowStockCount}
        />

        <Charts
          barChartData={barChartData}
          pieChartData={pieChartData}
        />

        {/* Search Bar */}
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search Product or Category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-box"
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(e.target.value)
            }
            style={{
              padding: "10px",
              borderRadius: "8px",
              width: "220px",
            }}
          >
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              width: "220px",
            }}
          >
            <option value="">Sort Products</option>
            <option value="name">Name (A-Z)</option>
            <option value="quantity">
              Quantity (High-Low)
            </option>
            <option value="profit">
              Profit (High-Low)
            </option>
          </select>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <button
            onClick={exportToExcel}
            style={{
              background: "#27ae60",
              color: "white",
              border: "none",
              padding: "12px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            📥 Export Inventory to Excel
          </button>
        </div>

        <h2>➕ Add / Update Product</h2>
        <p>
          Fill in the details below to add a new product or
          update an existing one.
        </p>

        <form className="product-form" onSubmit={addProduct}>
          <input
            type="text"
            name="item_name"
            placeholder="Item Name"
            value={formData.item_name}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            step="0.01"
            name="buying_price"
            placeholder="Buying Price"
            value={formData.buying_price}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            step="0.01"
            name="selling_price"
            placeholder="Selling Price"
            value={formData.selling_price}
            onChange={handleChange}
            required
          />

          <button className="add-btn" type="submit">
            {editId ? "Update Product" : "Add Product"}
          </button>
        </form>

        {/* Products Table */}
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Buying</th>
              <th>Selling</th>
              <th>Profit/Unit</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.item_name}</td>
                <td>{item.category}</td>
                <td>{item.quantity}</td>
                <td>₹{item.buying_price}</td>
                <td>₹{item.selling_price}</td>
                <td>
                  ₹
                  {Number(item.selling_price) -
                    Number(item.buying_price)}
                </td>

                <td>
                  {Number(item.quantity) < 20 ? (
                    <span
                      style={{
                        color: "red",
                        fontWeight: "bold",
                      }}
                    >
                      ⚠️ Low Stock
                    </span>
                  ) : (
                    <span
                      style={{
                        color: "green",
                        fontWeight: "bold",
                      }}
                    >
                      In Stock
                    </span>
                  )}
                </td>

                <td>
                  <button
                    style={{
                      background: "#3498db",
                      color: "white",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      marginRight: "10px",
                    }}
                    onClick={() => editProduct(item)}
                  >
                    Edit
                  </button>

                  <button
                    style={{
                      background: "#27ae60",
                      color: "white",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      marginRight: "10px",
                    }}
                    onClick={() => sellProduct(item.id)}
                  >
                    <FaShoppingCart />
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteProduct(item.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="sales-history">
          <h2>📊 Sales History</h2>

          <table className="sales-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Product</th>
                <th>Quantity Sold</th>
                <th>Profit</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {sales.length > 0 ? (
                sales.map((sale) => (
                  <tr key={sale.id}>
                    <td>{sale.id}</td>
                    <td>{sale.item_name}</td>
                    <td>{sale.quantity_sold}</td>
                    <td>₹{Number(sale.profit).toFixed(2)}</td>
                    <td>
                      {new Date(sale.sale_date).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No sales found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default App;

