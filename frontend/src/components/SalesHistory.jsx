function SalesHistory({ sales }) {
  return (
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
  );
}

export default SalesHistory;