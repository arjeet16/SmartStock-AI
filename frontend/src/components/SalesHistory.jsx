import { useMemo, useState } from "react";

import {
  FaArrowTrendUp,
  FaBox,
  FaCalendarDays,
  FaChartLine,
  FaMagnifyingGlass,
  FaReceipt,
  FaSackDollar,
} from "react-icons/fa6";

function SalesHistory({ sales = [] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const totalRevenue = useMemo(
  () =>
    sales.reduce((sum, sale) => {
      const quantity = Number(sale.quantity_sold || 0);
      const sellingPrice = Number(sale.selling_price || 0);
      const recordedRevenue = Number(sale.revenue || 0);

      return sum + (
        recordedRevenue ||
        quantity * sellingPrice
      );
    }, 0),
  [sales]
);

  const totalProfit = useMemo(
    () =>
      sales.reduce(
        (sum, sale) => sum + Number(sale.profit || 0),
        0
      ),
    [sales]
  );

  const totalUnitsSold = useMemo(
    () =>
      sales.reduce(
        (sum, sale) =>
          sum + Number(sale.quantity_sold || 0),
        0
      ),
    [sales]
  );

  const bestSellingProduct = useMemo(() => {
    if (!sales.length) return "No Sales";

    const productTotals = sales.reduce((accumulator, sale) => {
      const productName = sale.item_name || "Unknown Product";

      accumulator[productName] =
        (accumulator[productName] || 0) +
        Number(sale.quantity_sold || 0);

      return accumulator;
    }, {});

    return Object.entries(productTotals).reduce(
      (best, current) =>
        current[1] > best[1] ? current : best,
      ["No Sales", 0]
    )[0];
  }, [sales]);

  const filteredSales = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase();

    if (!normalizedSearch) return sales;

    return sales.filter((sale) => {
      const productName = String(
        sale.item_name || ""
      ).toLowerCase();

      const saleId = String(sale.id || "").toLowerCase();

      return (
        productName.includes(normalizedSearch) ||
        saleId.includes(normalizedSearch)
      );
    });
  }, [sales, searchTerm]);

  return (
    <section className="sales-history-premium">
      <header className="sales-history-header">
        <div>
          <span className="sales-history-eyebrow">
            LIVE SALES INTELLIGENCE
          </span>

          <h2>Sales Performance Center</h2>

          <p>
            Track revenue, profit, units sold and product-level
            sales activity.
          </p>
        </div>

        <div className="sales-history-live">
          <span />
          Live Sales Data
        </div>
      </header>

      <div className="sales-summary-grid">
        <article className="sales-summary-card">
          <div className="sales-summary-icon">
            <FaSackDollar />
          </div>

          <div>
            <span>Total Revenue</span>
            <strong>
              ₹{totalRevenue.toLocaleString("en-IN")}
            </strong>
            <small>Gross sales value</small>
          </div>
        </article>

        <article className="sales-summary-card">
          <div className="sales-summary-icon">
            <FaArrowTrendUp />
          </div>

          <div>
            <span>Total Profit</span>
            <strong>
              ₹{totalProfit.toLocaleString("en-IN")}
            </strong>
            <small>Recorded sales profit</small>
          </div>
        </article>

        <article className="sales-summary-card">
          <div className="sales-summary-icon">
            <FaBox />
          </div>

          <div>
            <span>Units Sold</span>
            <strong>
              {totalUnitsSold.toLocaleString("en-IN")}
            </strong>
            <small>Across all transactions</small>
          </div>
        </article>

        <article className="sales-summary-card">
          <div className="sales-summary-icon">
            <FaChartLine />
          </div>

          <div>
            <span>Top Product</span>
            <strong>{bestSellingProduct}</strong>
            <small>Highest unit movement</small>
          </div>
        </article>
      </div>

      <div className="sales-table-card">
        <div className="sales-table-toolbar">
          <div>
            <span>TRANSACTION LOG</span>
            <h3>Recent Sales</h3>
          </div>

          <label className="sales-search-box">
            <FaMagnifyingGlass />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search product or sale ID..."
            />
          </label>
        </div>

        <div className="sales-table-scroll">
          <table className="sales-table-premium">
            <thead>
              <tr>
                <th>
                  <span>
                    <FaReceipt />
                    Sale ID
                  </span>
                </th>

                <th>Product</th>
                <th>Quantity Sold</th>
                <th>Profit</th>

                <th>
                  <span>
                    <FaCalendarDays />
                    Date
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredSales.length > 0 ? (
                filteredSales.map((sale) => {
                  const profit = Number(sale.profit || 0);

                  return (
                    <tr key={sale.id}>
                      <td>
                        <span className="sales-id-badge">
                          #{sale.id}
                        </span>
                      </td>

                      <td>
                        <div className="sales-product-cell">
                          <div className="sales-product-avatar">
                            {String(
                              sale.item_name || "P"
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <strong>
                              {sale.item_name ||
                                "Unknown Product"}
                            </strong>

                            <small>
                              Completed transaction
                            </small>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="sales-quantity-badge">
                          {Number(
                            sale.quantity_sold || 0
                          ).toLocaleString("en-IN")}{" "}
                          units
                        </span>
                      </td>

                      <td>
                        <span
                          className={`sales-profit-value ${
                            profit > 0
                              ? "positive"
                              : "neutral"
                          }`}
                        >
                          ₹
                          {profit.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </td>

                      <td>
                        <div className="sales-date-cell">
                          <strong>
                            {new Date(
                              sale.sale_date
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </strong>

                          <small>
                            {new Date(
                              sale.sale_date
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                weekday: "short",
                              }
                            )}
                          </small>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5">
                    <div className="sales-empty-state">
                      <FaReceipt />

                      <strong>No sales found</strong>

                      <span>
                        Sales transactions will appear here.
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default SalesHistory;