import { motion } from "framer-motion";

import {
  FaBoxOpen,
  FaChartLine,
  FaPenToSquare,
  FaCartShopping,
  FaTrashCan,
  FaTriangleExclamation,
} from "react-icons/fa6";

import PremiumCard from "./premium/PremiumCard";
import SectionHeader from "./premium/SectionHeader";
import LiveBadge from "./premium/LiveBadge";
import { staggerContainer, fadeUp } from "../utils/motion";

function getStockStatus(quantity) {
  const stock = Number(quantity);

  if (stock <= 0) {
    return {
      label: "Out of Stock",
      className: "status-critical",
      health: 0,
    };
  }

  if (stock < 10) {
    return {
      label: "Critical",
      className: "status-critical",
      health: 22,
    };
  }

  if (stock < 20) {
    return {
      label: "Low Stock",
      className: "status-warning",
      health: 48,
    };
  }

  if (stock < 50) {
    return {
      label: "Moderate",
      className: "status-moderate",
      health: 72,
    };
  }

  return {
    label: "Healthy",
    className: "status-healthy",
    health: 94,
  };
}

function getAIRecommendation(item, profit) {
  const quantity = Number(item.quantity);

  if (quantity <= 0) {
    return {
      label: "Immediate Restock",
      className: "ai-critical",
      icon: <FaTriangleExclamation />,
    };
  }

  if (quantity < 10) {
    return {
      label: "Restock Now",
      className: "ai-critical",
      icon: <FaTriangleExclamation />,
    };
  }

  if (quantity < 20) {
    return {
      label: "Restock Soon",
      className: "ai-warning",
      icon: <FaBoxOpen />,
    };
  }

  if (profit <= 0) {
    return {
      label: "Review Pricing",
      className: "ai-review",
      icon: <FaChartLine />,
    };
  }

  if (quantity >= 80) {
    return {
      label: "Monitor Movement",
      className: "ai-review",
      icon: <FaChartLine />,
    };
  }

  return {
    label: "Inventory Stable",
    className: "ai-stable",
    icon: <FaChartLine />,
  };
}

function ProductTable({
  filteredProducts = [],
  editProduct,
  sellProduct,
  deleteProduct,
}) {
  const totalInventoryValue = filteredProducts.reduce(
    (sum, item) =>
      sum +
      Number(item.quantity || 0) *
        Number(item.buying_price || 0),
    0
  );

  const lowStockCount = filteredProducts.filter(
    (item) =>
      Number(item.quantity) > 0 &&
      Number(item.quantity) < 20
  ).length;

  const outOfStockCount = filteredProducts.filter(
    (item) => Number(item.quantity) <= 0
  ).length;

  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="inventory-intelligence-section"
    >
      <PremiumCard
        className="inventory-intelligence-card"
        hover={false}
      >
        <SectionHeader
          eyebrow="INVENTORY CONTROL"
          title="Product Intelligence Center"
          description="Monitor stock health, pricing, profit margins and AI-driven inventory recommendations."
          action={
            <LiveBadge
              label={`${filteredProducts.length} Products`}
            />
          }
        />

        <div className="inventory-summary-grid">
          <article className="inventory-summary-card">
            <span>Total Products</span>
            <strong>{filteredProducts.length}</strong>
            <small>Active inventory items</small>
          </article>

          <article className="inventory-summary-card">
            <span>Inventory Value</span>
            <strong>
              ₹
              {totalInventoryValue.toLocaleString("en-IN", {
                maximumFractionDigits: 0,
              })}
            </strong>
            <small>Current buying value</small>
          </article>

          <article className="inventory-summary-card">
            <span>Low Stock</span>
            <strong>{lowStockCount}</strong>
            <small>Need attention soon</small>
          </article>

          <article className="inventory-summary-card">
            <span>Out of Stock</span>
            <strong>{outOfStockCount}</strong>
            <small>Immediate restock required</small>
          </article>
        </div>

        <div className="inventory-table-scroll">
          <table className="inventory-premium-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Stock Health</th>
                <th>Buying Price</th>
                <th>Selling Price</th>
                <th>Profit</th>
                <th>AI Recommendation</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((item, index) => {
                  const buyingPrice = Number(
                    item.buying_price || 0
                  );

                  const sellingPrice = Number(
                    item.selling_price || 0
                  );

                  const profit =
                    sellingPrice - buyingPrice;

                  const profitPercent =
                    buyingPrice > 0
                      ? (profit / buyingPrice) * 100
                      : 0;
                  const totalUnits = Number(item.quantity || 0);

const unitsPerCarton =
  Number(item.units_per_carton) || 1;

const cartons = Math.floor(
  totalUnits / unitsPerCarton
);

const openUnits =
  totalUnits % unitsPerCarton;
                  const status = getStockStatus(
                    item.quantity
                  );

                  const recommendation =
                    getAIRecommendation(item, profit);

                  return (
                    <motion.tr
                      key={item.id}
                      variants={fadeUp}
                      custom={index}
                      whileHover={{ scale: 1.003 }}
                    >
                      <td>
                        <div className="inventory-product-cell">
                          <div className="inventory-product-avatar">
                            {item.item_name
                              ?.charAt(0)
                              ?.toUpperCase() || "P"}
                          </div>

                          <div>
                            <strong>
                              {item.item_name}
                            </strong>

                            <span>
                              Product ID #{item.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="inventory-category-pill">
                          {item.category}
                        </span>
                      </td>

                      <td>
                        <div className="inventory-stock-health">
                        <div className="inventory-stock-top">
  <strong>
    📦 {cartons} Carton{cartons !== 1 ? "s" : ""}
  </strong>
</div>

<div
  style={{
    marginTop: 6,
    fontSize: 13,
    color: "#64748b",
    lineHeight: 1.6,
  }}
>
  <div>
    📦 <strong>{unitsPerCarton}</strong> Units /
    Carton
  </div>

  <div>
    📂 <strong>{openUnits}</strong> Open Units
  </div>

  <div>
    📊 <strong>{totalUnits}</strong> Total Units
  </div>
</div>
                          <div className="inventory-health-track">
                            <span
                              className={
                                status.className
                              }
                              style={{
                                width: `${status.health}%`,
                              }}
                            />
                          </div>

                          <small
                            className={`inventory-status-label ${status.className}`}
                          >
                            {status.label}
                          </small>
                        </div>
                      </td>

                      <td>
                        <span className="inventory-price">
                          ₹
                          {buyingPrice.toLocaleString(
                            "en-IN",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </span>
                      </td>

                      <td>
                        <span className="inventory-price">
                          ₹
                          {sellingPrice.toLocaleString(
                            "en-IN",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </span>
                      </td>

                      <td>
                        <div className="inventory-profit-cell">
                          <strong>
                            ₹
                            {profit.toLocaleString(
                              "en-IN",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </strong>

                          <small>
                            {profitPercent.toFixed(1)}%
                            margin
                          </small>
                        </div>
                      </td>

                      <td>
                        <span
                          className={`inventory-ai-pill ${recommendation.className}`}
                        >
                          {recommendation.icon}
                          {recommendation.label}
                        </span>
                      </td>

                      <td>
                        <div className="inventory-action-group">
                          <button
                            type="button"
                            className="inventory-action-button edit"
                            onClick={() =>
                              editProduct(item)
                            }
                            title="Edit product"
                            aria-label={`Edit ${item.item_name}`}
                          >
                            <FaPenToSquare />
                          </button>

                          <button
                            type="button"
                            className="inventory-action-button sell"
                            onClick={() =>
                              sellProduct(item.id)
                            }
                            title="Sell product"
                            aria-label={`Sell ${item.item_name}`}
                          >
                            <FaCartShopping />
                          </button>

                          <button
                            type="button"
                            className="inventory-action-button delete"
                            onClick={() =>
                              deleteProduct(item.id)
                            }
                            title="Delete product"
                            aria-label={`Delete ${item.item_name}`}
                          >
                           <FaTrashCan /> 
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8">
                    <div className="inventory-empty-state">
                      <FaBoxOpen />

                      <strong>
                        No products found
                      </strong>

                      <span>
                        Add a product or change your filters.
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </PremiumCard>
    </motion.section>
  );
}

export default ProductTable;