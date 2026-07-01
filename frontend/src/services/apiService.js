const API_BASE_URL = "http://localhost:5000";

export async function fetchProducts() {
  const response = await fetch(`${API_BASE_URL}/products`);
  return response.json();
}

export async function fetchSales() {
  const response = await fetch(`${API_BASE_URL}/sales`);
  return response.json();
}

export async function createProduct(productData) {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  return response.json();
}

export async function updateProduct(id, productData) {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  return response.json();
}

export async function removeProduct(id) {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "DELETE",
  });

  return response.json();
}

export async function sellProductAPI(productId, quantitySold = 1) {
  const response = await fetch(`${API_BASE_URL}/sell`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product_id: productId,
      quantity_sold: quantitySold,
    }),
  });

  return response.json();
}