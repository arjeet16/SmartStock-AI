require("dotenv").config();
console.log("SERVER FILE LOADED");
const db = require("./config/db");
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { askAI } = require("./gemini");
const app = express();
const { generateInventoryReport } = require("./gemini");
const { formatAIReport } = require("./services/aiReportFormatter");
const { calculateForecast } = require("./forecast");
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Inventory API Running");
});


// GET ALL PRODUCTS
app.get("/products", (req, res) => {

    const sql = "SELECT * FROM stock_items";

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);
    });
});


// ADD PRODUCT
app.post("/products", (req, res) => {

    const {
        item_name,
        category,
        quantity,
        buying_price,
        selling_price
    } = req.body;

    const sql = `
        INSERT INTO stock_items
        (item_name, category, quantity, buying_price, selling_price)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [item_name, category, quantity, buying_price, selling_price],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "Product Added Successfully",
                id: result.insertId
            });
        }
    );
});


// UPDATE PRODUCT QUANTITY
// UPDATE PRODUCT
app.put("/products/:id", (req, res) => {

    const { id } = req.params;

    const {
        item_name,
        category,
        quantity,
        buying_price,
        selling_price
    } = req.body;

    const sql = `
        UPDATE stock_items
        SET
        item_name = ?,
        category = ?,
        quantity = ?,
        buying_price = ?,
        selling_price = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            item_name,
            category,
            quantity,
            buying_price,
            selling_price,
            id
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "Product Updated Successfully"
            });
        }
    );
});


// UPDATE COMPLETE PRODUCT (NEW)
app.put("/products/edit/:id", (req, res) => {

    const { id } = req.params;

    const {
        item_name,
        category,
        quantity,
        buying_price,
        selling_price
    } = req.body;

    const sql = `
        UPDATE stock_items
        SET
            item_name = ?,
            category = ?,
            quantity = ?,
            buying_price = ?,
            selling_price = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            item_name,
            category,
            quantity,
            buying_price,
            selling_price,
            id
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "Product Updated Successfully"
            });
        }
    );
});


// DELETE PRODUCT
app.delete("/products/:id", (req, res) => {

    const { id } = req.params;

    const sql = "DELETE FROM stock_items WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json({
            message: "Product Deleted Successfully"
        });
    });
});
// SELL PRODUCT
app.post("/sell", (req, res) => {

    const { product_id, quantity_sold } = req.body;

    const getProductSql =
        "SELECT * FROM stock_items WHERE id = ?";

    db.query(
        getProductSql,
        [product_id],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (result.length === 0) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }

            const product = result[0];

            if (
                product.quantity < quantity_sold
            ) {
                return res.status(400).json({
                    message: "Insufficient Stock"
                });
            }

            const newQuantity =
                product.quantity - quantity_sold;

            const profit =
                quantity_sold *
                (
                    product.selling_price -
                    product.buying_price
                );

            const updateStockSql =
                "UPDATE stock_items SET quantity = ? WHERE id = ?";

            db.query(
                updateStockSql,
                [newQuantity, product_id],
                (err) => {

                    if (err) {
                        return res.status(500).json(err);
                    }

                    const saleSql = `
                        INSERT INTO sales
                        (product_id, quantity_sold, selling_price, profit)
                        VALUES (?, ?, ?, ?)
                    `;

                    db.query(
                        saleSql,
                        [
                            product_id,
                            quantity_sold,
                            product.selling_price,
                            profit,
                        ],
                        (err) => {

                            if (err) {
                                return res.status(500).json(err);
                            }

                            res.json({
                                message:
                                    "Sale Recorded Successfully",
                            });
                        }
                    );
                }
            );
        }
    );
});
// GET SALES HISTORY
app.get("/sales", (req, res) => {
    console.log("SALES API HIT");
    const sql = `
        SELECT
            sales.id,
            stock_items.item_name,
            sales.quantity_sold,
            sales.selling_price,
            sales.profit,
            sales.sale_date
        FROM sales
        JOIN stock_items
        ON sales.product_id = stock_items.id
        ORDER BY sales.sale_date DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);
    });
});
app.get("/test", (req, res) => {
    res.send("TEST ROUTE WORKING");
});
// ADMIN LOGIN API
app.post("/login", (req, res) => {
    console.log("LOGIN API HIT");

    const { username, password } = req.body;

    const sql =
        "SELECT * FROM admin_users WHERE username = ? AND password = ?";

    db.query(
        sql,
        [username, password],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (result.length > 0) {

                return res.json({
                    success: true,
                    message: "Login Successful"
                });

            } else {

                return res.json({
                    success: false,
                    message: "Invalid Username or Password"
                });

            }

        }
    );

});

// AI REPORT

app.post("/ai-report", async (req, res) => {
    console.log("AI REPORT API HIT");
  try {
    const {
      products,
      sales,
      totalRevenue,
      totalProfit,
      lowStockCount,
      bestSellingProduct,
    } = req.body;

    const report = await generateInventoryReport({
      products,
      sales,
      totalRevenue,
      totalProfit,
      lowStockCount,
      bestSellingProduct,
    });
    const formattedReport = formatAIReport(report);

    res.json({
  success: true,
  report: formattedReport,
});
} catch (error) {
  console.error("AI REPORT ERROR:", error.message);

  res.status(500).json({
    success: false,
    message: "Failed to generate AI report",
    error: error.message,
  });
}  
});
// AI COPILOT CHAT
app.post("/ai-chat", async (req, res) => {
  try {
    const { generateCopilotAnswer } = require("./gemini");

    const answer = await generateCopilotAnswer(req.body);

    res.json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error("AI CHAT ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to generate AI chat response",
      error: error.message,
    });
  }
});
    // ==============================
// AI Demand Forecast API
// ==============================

app.get("/forecast", async (req, res) => {
  try {
    // Get all products
    const [products] = await db.promise().query(
      "SELECT * FROM stock_items"
    );

    // Get all sales
   const [sales] = await db.promise().query(
  "SELECT * FROM sales"
);

    let forecast = calculateForecast(products, sales);

forecast = await Promise.all(
  forecast.map(async (item) => {
    try {
      const mlResponse = await axios.post("http://localhost:7000/predict", {
        current_stock: item.currentStock,
        avg_daily_sales: item.averageDailySales,
        days_remaining: item.daysRemaining,
        trend_percent: item.trendPercent,
      });
      console.log("ML response:", mlResponse.data);

  let mlPrediction = mlResponse.data.predicted_30_day_demand;

if (Number(item.averageDailySales) === 0) {
  mlPrediction = 0;
}

      const mlRecommendedRestock = Math.max(
        0,
        mlPrediction - item.currentStock
      );

      const businessExplanation = [];

if (item.averageDailySales === 0) {
  businessExplanation.push("No measurable demand detected in recent sales.");
  businessExplanation.push("Current inventory is sufficient.");
  businessExplanation.push("No restocking is required at this time.");
} else {
  businessExplanation.push(
    `Current inventory will last about ${item.daysRemaining} days.`
  );

  businessExplanation.push(
    `Demand trend is ${item.trend.toLowerCase()}${
      item.trendPercent > 0 ? ` by ${item.trendPercent}%` : ""
    }.`
  );

  businessExplanation.push(
    `ML predicts ${mlPrediction} units demand for the next 30 days.`
  );

  businessExplanation.push(
    `Recommended restock quantity is ${mlRecommendedRestock} units.`
  );

  businessExplanation.push(
    `Forecast confidence is ${item.confidence}%.`
  );
}

return {
  ...item,
  mlForecast30Days: mlPrediction,
  mlRecommendedRestock,
  forecastSource: "ML Random Forest",
  predictionExplanation: mlResponse.data.explanation,
  businessExplanation,
};
    } catch (error) {
      return {
        ...item,
        mlForecast30Days: item.forecast30Days,
        mlRecommendedRestock: item.recommendedRestock,
        forecastSource: "Rule Based Fallback",
      };
    }
  })
);
console.log("FINAL FORECAST SENT:", forecast[0]);
    res.json({
      success: true,
      forecast,
    });

  } catch (error) {
  console.error("Forecast Error:", error);

  res.status(500).json({
    success: false,
    message: error.message,
    error,
  });
}
});
// ==============================
// ML Model Metrics API
// ==============================

app.get("/ml-metrics", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:7000/metrics");

    res.json(response.data);
  } catch (error) {
    console.error("ML Metrics Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to fetch ML model metrics.",
    });
  }
});
app.post("/forecast/simulate", async (req, res) => {
  try {
    const {
      currentStock,
      additionalStock,
      averageDailySales,
      trendPercent,
    } = req.body;

    const newStock =
      Number(currentStock) + Number(additionalStock);

    const daysCoverage =
      averageDailySales > 0
        ? Math.round(newStock / averageDailySales)
        : 999;

    const mlResponse = await axios.post(
      "http://localhost:7000/predict",
      {
        current_stock: newStock,
        avg_daily_sales: averageDailySales,
        days_remaining: daysCoverage,
        trend_percent: trendPercent,
      }
    );

    const predictedDemand =
      mlResponse.data.predicted_30_day_demand;

    const remaining =
      newStock - predictedDemand;

    let recommendation = "";

    if (remaining < 0)
      recommendation =
        "Stock is still insufficient.";

    else if (remaining < 20)
      recommendation =
        "Inventory will be tight.";

    else
      recommendation =
        "Inventory should comfortably meet demand.";

    res.json({
      success: true,
      currentStock,
      additionalStock,
      newStock,
      predictedDemand,
      remainingStock: remaining,
      daysCoverage,
      recommendation,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
const PORT = 5000;

app.listen(PORT, () => {

  console.log(`Server Running On Port ${PORT}`);
});