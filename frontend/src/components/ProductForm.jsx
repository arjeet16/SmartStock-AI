import {
  FaBoxOpen,
  FaLayerGroup,
  FaRupeeSign,
  FaHashtag,
  FaBoxes,
  FaCube,
} from "react-icons/fa";

function ProductForm({
  formData,
  handleChange,
  addProduct,
  editId,
}) {
  const cartonCount = Number(
    formData.carton_count || 0
  );

  const unitsPerCarton = Number(
    formData.units_per_carton || 1
  );

  const openUnits = Number(
    formData.open_units || 0
  );

  const totalUnits =
    cartonCount * unitsPerCarton + openUnits;

  return (
    <section className="product-form-section">
      <div className="product-form-heading">
        <div>
          <span className="product-form-label">
            Product Management
          </span>

          <h2>
            {editId
              ? "Update Inventory Item"
              : "Add New Product"}
          </h2>

          <p>
            Add, update and manage product pricing,
            stock, carton size and profitability.
          </p>
        </div>

        <span className="product-form-mode">
          {editId ? "Edit Mode" : "Create Mode"}
        </span>
      </div>

      <form
        className="product-form"
        onSubmit={addProduct}
      >
        <label className="product-input-group">
          <FaBoxOpen />

          <input
            type="text"
            name="item_name"
            value={formData.item_name}
            onChange={handleChange}
            placeholder="Item Name"
            required
          />
        </label>

        <label className="product-input-group">
          <FaLayerGroup />

          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Category"
            required
          />
        </label>

        <label className="product-input-group">
          <FaBoxes />

          <input
            type="number"
            name="carton_count"
            min="0"
            step="1"
            value={formData.carton_count}
            onChange={handleChange}
            placeholder="Number of Cartons"
            required
          />
        </label>

        <label className="product-input-group">
        <FaCube />

          <input
            type="number"
            name="units_per_carton"
            min="1"
            step="1"
            value={formData.units_per_carton}
            onChange={handleChange}
            placeholder="Units per Carton"
            required
          />
        </label>

        <label className="product-input-group">
          <FaHashtag />

          <input
            type="number"
            name="open_units"
            min="0"
            max={Math.max(unitsPerCarton - 1, 0)}
            step="1"
            value={formData.open_units}
            onChange={handleChange}
            placeholder="Open Units"
            required
          />
        </label>

        <label className="product-input-group">
          <FaHashtag />

          <input
  type="text"
  value={`${totalUnits} Total Units`}
  aria-label="Total Units"
  readOnly
/>
        </label>

        <label className="product-input-group">
          <FaRupeeSign />

          <input
            type="number"
            name="buying_price"
            min="0"
            step="0.01"
            value={formData.buying_price}
            onChange={handleChange}
            placeholder="Buying Price per Unit"
            required
          />
        </label>

        <label className="product-input-group">
          <FaRupeeSign />

          <input
            type="number"
            name="selling_price"
            min="0"
            step="0.01"
            value={formData.selling_price}
            onChange={handleChange}
            placeholder="Selling Price per Unit"
            required
          />
        </label>

        <button
          type="submit"
          className="product-submit-button"
        >
          {editId
            ? "Update Product"
            : "Add Product"}
        </button>
      </form>
    </section>
  );
}

export default ProductForm;