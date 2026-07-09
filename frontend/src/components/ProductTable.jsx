import { motion } from "framer-motion";
import { FaEdit, FaShoppingCart, FaTrash } from "react-icons/fa";
import PremiumCard from "./premium/PremiumCard";
import SectionHeader from "./premium/SectionHeader";
import LiveBadge from "./premium/LiveBadge";
import { staggerContainer, fadeUp } from "../utils/motion";

function getStockStatus(quantity) {
  const stock = Number(quantity);

  if (stock <= 0) return { label: "Out of Stock", className: "status-critical" };
  if (stock < 20) return { label: "Low Stock", className: "status-warning" };

  return { label: "Healthy", className: "status-healthy" };
}

function ProductTable({
  filteredProducts,
  editProduct,
  sellProduct,
  deleteProduct,
}) {
  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="inventory-v5-section"
    >
      <PremiumCard className="inventory-v5-card" hover={false}>
        <SectionHeader
          eyebrow="INVENTORY CONTROL"
          title="Product Intelligence Table"
          description="Monitor stock health, pricing, profit margin and inventory risk from one command center."
          action={<LiveBadge label={`${filteredProducts.length} Products`} />}
        />

        <div className="inventory-v5-scroll">
          <table className="inventory-v5-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Buying</th>
                <th>Selling</th>
                <th>Profit</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((item, index) => {
                const profit =
                  Number(item.selling_price) - Number(item.buying_price);

                const status = getStockStatus(item.quantity);

                return (
                  <motion.tr
                    key={item.id}
                    variants={fadeUp}
                    custom={index}
                    whileHover={{ scale: 1.005 }}
                  >
                    <td>
                      <div className="product-cell">
                        <div className="product-avatar-v5">
                          {item.item_name?.charAt(0)}
                        </div>

                        <div>
                          <strong>{item.item_name}</strong>
                          <span>ID #{item.id}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="category-pill-v5">{item.category}</span>
                    </td>

                    <td>
                      <div className="stock-cell-v5">
                        <strong>{item.quantity}</strong>
                        <span>units</span>
                      </div>
                    </td>

                    <td>₹{Number(item.buying_price).toFixed(2)}</td>

                    <td>₹{Number(item.selling_price).toFixed(2)}</td>

                    <td>
                      <strong className="profit-text-v5">
                        ₹{profit.toFixed(2)}
                      </strong>
                    </td>

                    <td>
                      <span className={`stock-status-v5 ${status.className}`}>
                        {status.label}
                      </span>
                    </td>

                    <td>
                      <div className="table-actions-v5">
                        <button
                          className="action-btn-v5 edit-action"
                          onClick={() => editProduct(item)}
                          title="Edit Product"
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="action-btn-v5 sell-action"
                          onClick={() => sellProduct(item.id)}
                          title="Sell Product"
                        >
                          <FaShoppingCart />
                        </button>

                        <button
                          className="action-btn-v5 delete-action"
                          onClick={() => deleteProduct(item.id)}
                          title="Delete Product"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </PremiumCard>
    </motion.section>
  );
}

export default ProductTable;