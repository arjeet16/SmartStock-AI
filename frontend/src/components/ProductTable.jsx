import { FaShoppingCart, FaTrash } from "react-icons/fa";

function ProductTable({
  filteredProducts,
  editProduct,
  sellProduct,
  deleteProduct,
}) {
  return (
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
  );
}

export default ProductTable;