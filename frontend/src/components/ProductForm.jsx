import { FaBoxOpen, FaLayerGroup, FaRupeeSign, FaHashtag } from "react-icons/fa";

function ProductForm({ formData, handleChange, addProduct, editId }) {
  return (
    <div className="product-form-v2">
      <div className="product-form-header">
        <div>
          <p>Product Management</p>
          <h2>{editId ? "Update Inventory Item" : "Add New Product"}</h2>
          <span>
            Add, update and manage product pricing, stock and profitability.
          </span>
        </div>

        <div className="product-form-status">
          {editId ? "Edit Mode" : "Create Mode"}
        </div>
      </div>

      <form className="product-form-grid" onSubmit={addProduct}>
        <div className="form-field">
          <FaBoxOpen />
          <input
            type="text"
            name="item_name"
            placeholder="Item Name"
            value={formData.item_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <FaLayerGroup />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <FaHashtag />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <FaRupeeSign />
          <input
            type="number"
            step="0.01"
            name="buying_price"
            placeholder="Buying Price"
            value={formData.buying_price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <FaRupeeSign />
          <input
            type="number"
            step="0.01"
            name="selling_price"
            placeholder="Selling Price"
            value={formData.selling_price}
            onChange={handleChange}
            required
          />
        </div>

        <button className="product-submit-btn" type="submit">
          {editId ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
}

export default ProductForm;
