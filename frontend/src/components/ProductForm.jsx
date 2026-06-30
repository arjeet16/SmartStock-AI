function ProductForm({
  formData,
  handleChange,
  addProduct,
  editId,
}) {
  return (
    <>
      <h2>➕ Add / Update Product</h2>

      <p>
        Fill in the details below to add a new product or update an existing
        one.
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
    </>
  );
}

export default ProductForm;
