require("dotenv").config();

console.log("SERVER FILE LOADED");

const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const db = require("./config/db");
const {
  generateInventoryReport,
  generateCopilotAnswer,
} = require("./gemini");
const {
  formatAIReport,
} = require("./services/aiReportFormatter");
const { calculateForecast } = require("./forecast");

const app = express();

app.use(cors());
app.use(express.json());

/* =========================================================
   ROOT
========================================================= */

app.get("/", (req, res) => {
  res.send("Inventory API Running");
});

/* =========================================================
   PRODUCTS
========================================================= */

// GET ALL PRODUCTS
app.get("/products", (req, res) => {
  const sql = `
    SELECT *
    FROM stock_items
    ORDER BY id DESC
  `;

  db.query(sql, (error, results) => {
    if (error) {
      console.error("GET PRODUCTS ERROR:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to fetch products.",
        error: error.message,
      });
    }

    return res.json(results);
  });
});

// ADD PRODUCT
app.post("/products", (req, res) => {
  const {
    item_name,
    category,
    quantity,
    buying_price,
    selling_price,
  } = req.body;

  const cleanItemName = String(item_name || "").trim();
  const cleanCategory = String(category || "").trim();

  const normalizedQuantity = Number(quantity);
  const normalizedBuyingPrice = Number(buying_price);
  const normalizedSellingPrice = Number(selling_price);

  if (
    !cleanItemName ||
    !cleanCategory ||
    !Number.isFinite(normalizedQuantity) ||
    normalizedQuantity < 0 ||
    !Number.isFinite(normalizedBuyingPrice) ||
    normalizedBuyingPrice < 0 ||
    !Number.isFinite(normalizedSellingPrice) ||
    normalizedSellingPrice < 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide valid product details.",
    });
  }

  const sql = `
    INSERT INTO stock_items
    (
      item_name,
      category,
      quantity,
      buying_price,
      selling_price
    )
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      cleanItemName,
      cleanCategory,
      normalizedQuantity,
      normalizedBuyingPrice,
      normalizedSellingPrice,
    ],
    (error, result) => {
      if (error) {
        console.error("ADD PRODUCT ERROR:", error);

        return res.status(500).json({
          success: false,
          message: "Unable to add product.",
          error: error.message,
        });
      }

      return res.status(201).json({
        success: true,
        message: "Product Added Successfully",
        id: result.insertId,
      });
    }
  );
});

// UPDATE PRODUCT
app.put("/products/:id", (req, res) => {
  const { id } = req.params;

  const {
    item_name,
    category,
    quantity,
    buying_price,
    selling_price,
  } = req.body;

  const cleanItemName = String(item_name || "").trim();
  const cleanCategory = String(category || "").trim();

  const normalizedQuantity = Number(quantity);
  const normalizedBuyingPrice = Number(buying_price);
  const normalizedSellingPrice = Number(selling_price);

  if (
    !cleanItemName ||
    !cleanCategory ||
    !Number.isFinite(normalizedQuantity) ||
    normalizedQuantity < 0 ||
    !Number.isFinite(normalizedBuyingPrice) ||
    normalizedBuyingPrice < 0 ||
    !Number.isFinite(normalizedSellingPrice) ||
    normalizedSellingPrice < 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide valid product details.",
    });
  }

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
      cleanItemName,
      cleanCategory,
      normalizedQuantity,
      normalizedBuyingPrice,
      normalizedSellingPrice,
      id,
    ],
    (error, result) => {
      if (error) {
        console.error("UPDATE PRODUCT ERROR:", error);

        return res.status(500).json({
          success: false,
          message: "Unable to update product.",
          error: error.message,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Product not found.",
        });
      }

      return res.json({
        success: true,
        message: "Product Updated Successfully",
      });
    }
  );
});

// UPDATE COMPLETE PRODUCT
app.put("/products/edit/:id", (req, res) => {
  const { id } = req.params;

  const {
    item_name,
    category,
    quantity,
    buying_price,
    selling_price,
  } = req.body;

  const cleanItemName = String(item_name || "").trim();
  const cleanCategory = String(category || "").trim();

  const normalizedQuantity = Number(quantity);
  const normalizedBuyingPrice = Number(buying_price);
  const normalizedSellingPrice = Number(selling_price);

  if (
    !cleanItemName ||
    !cleanCategory ||
    !Number.isFinite(normalizedQuantity) ||
    normalizedQuantity < 0 ||
    !Number.isFinite(normalizedBuyingPrice) ||
    normalizedBuyingPrice < 0 ||
    !Number.isFinite(normalizedSellingPrice) ||
    normalizedSellingPrice < 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide valid product details.",
    });
  }

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
      cleanItemName,
      cleanCategory,
      normalizedQuantity,
      normalizedBuyingPrice,
      normalizedSellingPrice,
      id,
    ],
    (error, result) => {
      if (error) {
        console.error("EDIT PRODUCT ERROR:", error);

        return res.status(500).json({
          success: false,
          message: "Unable to update product.",
          error: error.message,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Product not found.",
        });
      }

      return res.json({
        success: true,
        message: "Product Updated Successfully",
      });
    }
  );
});

// DELETE PRODUCT
app.delete("/products/:id", (req, res) => {
  const { id } = req.params;

  const sql = `
    DELETE FROM stock_items
    WHERE id = ?
  `;

  db.query(sql, [id], (error, result) => {
    if (error) {
      console.error("DELETE PRODUCT ERROR:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to delete product.",
        error: error.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.json({
      success: true,
      message: "Product Deleted Successfully",
    });
  });
});

/* =========================================================
   SALES
========================================================= */

// SELL PRODUCT
app.post("/sell", (req, res) => {
  const { product_id, quantity_sold } = req.body;

  const normalizedProductId = Number(product_id);
  const normalizedQuantitySold = Number(quantity_sold);

  if (
    !Number.isInteger(normalizedProductId) ||
    normalizedProductId <= 0 ||
    !Number.isInteger(normalizedQuantitySold) ||
    normalizedQuantitySold <= 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid product and quantity.",
    });
  }

  const getProductSql = `
    SELECT *
    FROM stock_items
    WHERE id = ?
  `;

  db.query(
    getProductSql,
    [normalizedProductId],
    (productError, products) => {
      if (productError) {
        console.error(
          "SELL PRODUCT FETCH ERROR:",
          productError
        );

        return res.status(500).json({
          success: false,
          message: "Unable to fetch product.",
          error: productError.message,
        });
      }

      if (products.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Product not found.",
        });
      }

      const product = products[0];

      const availableQuantity = Number(product.quantity || 0);

      if (availableQuantity < normalizedQuantitySold) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock. Only ${availableQuantity} units are available.`,
        });
      }

      const newQuantity =
        availableQuantity - normalizedQuantitySold;

      const buyingPrice = Number(
        product.buying_price || 0
      );

      const sellingPrice = Number(
        product.selling_price || 0
      );

      const profit =
        normalizedQuantitySold *
        (sellingPrice - buyingPrice);

      const updateStockSql = `
        UPDATE stock_items
        SET quantity = ?
        WHERE id = ?
      `;

      db.query(
        updateStockSql,
        [newQuantity, normalizedProductId],
        (updateError) => {
          if (updateError) {
            console.error(
              "SELL STOCK UPDATE ERROR:",
              updateError
            );

            return res.status(500).json({
              success: false,
              message: "Unable to update stock.",
              error: updateError.message,
            });
          }

          const saleSql = `
            INSERT INTO sales
            (
              product_id,
              quantity_sold,
              selling_price,
              profit
            )
            VALUES (?, ?, ?, ?)
          `;

          db.query(
            saleSql,
            [
              normalizedProductId,
              normalizedQuantitySold,
              sellingPrice,
              profit,
            ],
            (saleError, saleResult) => {
              if (saleError) {
                console.error(
                  "SALE INSERT ERROR:",
                  saleError
                );

                return res.status(500).json({
                  success: false,
                  message:
                    "Stock updated, but sale history could not be recorded.",
                  error: saleError.message,
                });
              }

              return res.status(201).json({
                success: true,
                message: "Sale Recorded Successfully",
                sale_id: saleResult.insertId,
                remaining_quantity: newQuantity,
                profit,
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

  db.query(sql, (error, results) => {
    if (error) {
      console.error("GET SALES ERROR:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to fetch sales history.",
        error: error.message,
      });
    }

    return res.json(results);
  });
});

/* =========================================================
   TEST
========================================================= */

app.get("/test", (req, res) => {
  res.send("TEST ROUTE WORKING");
});

/* =========================================================
   AUTHENTICATION
========================================================= */

// CREATE ACCOUNT
app.post("/register", async (req, res) => {
  try {
    const {
      full_name,
      company_name,
      email,
      mobile_number,
      password,
      confirm_password,
    } = req.body;

    const cleanName = String(
      full_name || ""
    ).trim();

    const cleanCompany =
      String(company_name || "").trim() ||
      "SmartStock AI";

    const cleanEmail = String(email || "")
      .trim()
      .toLowerCase();

    const cleanMobile = String(
      mobile_number || ""
    ).trim();

    if (
      !cleanName ||
      !cleanEmail ||
      !password ||
      !confirm_password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please complete all required fields.",
      });
    }

    if (password !== confirm_password) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 8 characters.",
      });
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email address.",
      });
    }

    const [existingUsers] =
      await db.promise().query(
        `
          SELECT id
          FROM users
          WHERE LOWER(email) = ?
          LIMIT 1
        `,
        [cleanEmail]
      );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists.",
      });
    }

    const passwordHash = await bcrypt.hash(
      password,
      12
    );

    const [result] = await db.promise().query(
      `
        INSERT INTO users
        (
          full_name,
          company_name,
          email,
          mobile_number,
          password_hash
        )
        VALUES (?, ?, ?, ?, ?)
      `,
      [
        cleanName,
        cleanCompany,
        cleanEmail,
        cleanMobile || null,
        passwordHash,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      user: {
        id: result.insertId,
        full_name: cleanName,
        company_name: cleanCompany,
        email: cleanEmail,
        mobile_number: cleanMobile || null,
        role: "Administrator",
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create account.",
      error: error.message,
    });
  }
});

// LOGIN WITH EMAIL, MOBILE OR LEGACY ADMIN USERNAME
app.post("/login", async (req, res) => {
  try {
    const identifier = String(
      req.body.identifier ||
        req.body.username ||
        req.body.email ||
        ""
    )
      .trim()
      .toLowerCase();

    const password = String(
      req.body.password || ""
    );

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email, username and password are required.",
      });
    }

    const [users] =
      await db.promise().query(
        `
          SELECT
            id,
            full_name,
            company_name,
            email,
            mobile_number,
            password_hash,
            role
          FROM users
          WHERE LOWER(email) = ?
             OR mobile_number = ?
          LIMIT 1
        `,
        [identifier, identifier]
      );

    if (users.length > 0) {
      const user = users[0];

      const storedPassword = String(
        user.password_hash || ""
      );

      let passwordMatches = false;

      const isBcryptHash =
        storedPassword.startsWith("$2a$") ||
        storedPassword.startsWith("$2b$") ||
        storedPassword.startsWith("$2y$");

      if (isBcryptHash) {
        passwordMatches =
          await bcrypt.compare(
            password,
            storedPassword
          );
      } else {
        passwordMatches =
          password === storedPassword;

        if (passwordMatches) {
          const upgradedHash =
            await bcrypt.hash(password, 12);

          await db.promise().query(
            `
              UPDATE users
              SET password_hash = ?
              WHERE id = ?
            `,
            [upgradedHash, user.id]
          );
        }
      }

      if (!passwordMatches) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Login successful.",
        user: {
          id: user.id,
          full_name: user.full_name,
          company_name: user.company_name,
          email: user.email,
          mobile_number: user.mobile_number,
          role:
            user.role || "Administrator",
        },
      });
    }

    const [legacyAdmins] =
      await db.promise().query(
        `
          SELECT *
          FROM admin_users
          WHERE LOWER(username) = ?
          LIMIT 1
        `,
        [identifier]
      );

    if (legacyAdmins.length > 0) {
      const admin = legacyAdmins[0];

      const storedAdminPassword =
        String(admin.password || "");

      let adminPasswordMatches = false;

      const isAdminBcryptHash =
        storedAdminPassword.startsWith("$2a$") ||
        storedAdminPassword.startsWith("$2b$") ||
        storedAdminPassword.startsWith("$2y$");

      if (isAdminBcryptHash) {
        adminPasswordMatches =
          await bcrypt.compare(
            password,
            storedAdminPassword
          );
      } else {
        adminPasswordMatches =
          password === storedAdminPassword;
      }

      if (adminPasswordMatches) {
        return res.status(200).json({
          success: true,
          message: "Login successful.",
          user: {
            id: admin.id,
            full_name: admin.username,
            company_name: "SmartStock AI",
            email: null,
            mobile_number: null,
            role: "Administrator",
          },
        });
      }
    }

    return res.status(401).json({
      success: false,
      message:
        "Invalid email, username or password.",
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to sign in.",
      error: error.message,
    });
  }
});

/* =========================================================
   AI REPORT
========================================================= */

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

    const report =
      await generateInventoryReport({
        products,
        sales,
        totalRevenue,
        totalProfit,
        lowStockCount,
        bestSellingProduct,
      });

    const formattedReport =
      formatAIReport(report);

    return res.json({
      success: true,
      report: formattedReport,
    });
  } catch (error) {
    console.error(
      "AI REPORT ERROR:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to generate AI report",
      error: error.message,
    });
  }
});

/* =========================================================
   AI COPILOT
========================================================= */

app.post("/ai-chat", async (req, res) => {
  try {
    const answer =
      await generateCopilotAnswer(req.body);

    return res.json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error(
      "AI CHAT ERROR:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to generate AI chat response",
      error: error.message,
    });
  }
});

/* =========================================================
   AI DEMAND FORECAST
========================================================= */

app.get("/forecast", async (req, res) => {
  try {
    const [products] =
      await db.promise().query(
        `
          SELECT *
          FROM stock_items
        `
      );

    const [sales] =
      await db.promise().query(
        `
          SELECT *
          FROM sales
        `
      );

    let forecast =
      calculateForecast(products, sales);

    forecast = await Promise.all(
      forecast.map(async (item) => {
        try {
          const mlResponse =
            await axios.post(
              "http://localhost:7000/predict",
              {
                current_stock:
                  item.currentStock,
                avg_daily_sales:
                  item.averageDailySales,
                days_remaining:
                  item.daysRemaining,
                trend_percent:
                  item.trendPercent,
              }
            );

          console.log(
            "ML response:",
            mlResponse.data
          );

          let mlPrediction = Number(
            mlResponse.data
              .predicted_30_day_demand || 0
          );

          if (
            Number(item.averageDailySales) === 0
          ) {
            mlPrediction = 0;
          }

          const mlRecommendedRestock =
            Math.max(
              0,
              mlPrediction -
                Number(item.currentStock)
            );

          const businessExplanation = [];

          if (
            Number(item.averageDailySales) === 0
          ) {
            businessExplanation.push(
              "No measurable demand detected in recent sales."
            );

            businessExplanation.push(
              "Current inventory is sufficient."
            );

            businessExplanation.push(
              "No restocking is required at this time."
            );
          } else {
            businessExplanation.push(
              `Current inventory will last about ${item.daysRemaining} days.`
            );

            businessExplanation.push(
              `Demand trend is ${String(
                item.trend || "stable"
              ).toLowerCase()}${
                Number(item.trendPercent) > 0
                  ? ` by ${item.trendPercent}%`
                  : ""
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
            mlForecast30Days:
              mlPrediction,
            mlRecommendedRestock,
            forecastSource:
              "ML Random Forest",
            predictionExplanation:
              mlResponse.data.explanation,
            businessExplanation,
          };
        } catch (error) {
          console.error(
            "ML FORECAST FALLBACK:",
            error.message
          );

          return {
            ...item,
            mlForecast30Days:
              item.forecast30Days,
            mlRecommendedRestock:
              item.recommendedRestock,
            forecastSource:
              "Rule Based Fallback",
          };
        }
      })
    );

    console.log(
      "FINAL FORECAST SENT:",
      forecast[0]
    );

    return res.json({
      success: true,
      forecast,
    });
  } catch (error) {
    console.error(
      "FORECAST ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
      error,
    });
  }
});

/* =========================================================
   ML MODEL METRICS
========================================================= */

app.get("/ml-metrics", async (req, res) => {
  try {
    const response = await axios.get(
      "http://localhost:7000/metrics"
    );

    return res.json(response.data);
  } catch (error) {
    console.error(
      "ML Metrics Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch ML model metrics.",
    });
  }
});

/* =========================================================
   FORECAST SIMULATOR
========================================================= */

app.post(
  "/forecast/simulate",
  async (req, res) => {
    try {
      const {
        currentStock,
        additionalStock,
        averageDailySales,
        trendPercent,
      } = req.body;

      const normalizedCurrentStock =
        Number(currentStock || 0);

      const normalizedAdditionalStock =
        Number(additionalStock || 0);

      const normalizedAverageDailySales =
        Number(averageDailySales || 0);

      const normalizedTrendPercent =
        Number(trendPercent || 0);

      const newStock =
        normalizedCurrentStock +
        normalizedAdditionalStock;

      const daysCoverage =
        normalizedAverageDailySales > 0
          ? Math.round(
              newStock /
                normalizedAverageDailySales
            )
          : 999;

      const mlResponse =
        await axios.post(
          "http://localhost:7000/predict",
          {
            current_stock: newStock,
            avg_daily_sales:
              normalizedAverageDailySales,
            days_remaining: daysCoverage,
            trend_percent:
              normalizedTrendPercent,
          }
        );

      const predictedDemand = Number(
        mlResponse.data
          .predicted_30_day_demand || 0
      );

      const remaining =
        newStock - predictedDemand;

      let recommendation = "";

      if (remaining < 0) {
        recommendation =
          "Stock is still insufficient.";
      } else if (remaining < 20) {
        recommendation =
          "Inventory will be tight.";
      } else {
        recommendation =
          "Inventory should comfortably meet demand.";
      }

      return res.json({
        success: true,
        currentStock:
          normalizedCurrentStock,
        additionalStock:
          normalizedAdditionalStock,
        newStock,
        predictedDemand,
        remainingStock: remaining,
        daysCoverage,
        recommendation,
      });
    } catch (error) {
      console.error(
        "FORECAST SIMULATION ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

/* =========================================================
   AI SCENARIO SIMULATOR
========================================================= */

app.post(
  "/scenario-simulate",
  async (req, res) => {
    try {
      const {
        currentStock,
        averageDailySales,
        trendPercent,
        demandIncreasePercent,
      } = req.body;

      const normalizedCurrentStock =
        Number(currentStock || 0);

      const normalizedAverageDailySales =
        Number(averageDailySales || 0);

      const normalizedTrendPercent =
        Number(trendPercent || 0);

      const normalizedDemandIncrease =
        Number(demandIncreasePercent || 0);

      const adjustedDailySales =
        normalizedAverageDailySales *
        (
          1 +
          normalizedDemandIncrease / 100
        );

      const adjustedDaysRemaining =
        adjustedDailySales > 0
          ? Math.floor(
              normalizedCurrentStock /
                adjustedDailySales
            )
          : 999;

      const mlResponse =
        await axios.post(
          "http://localhost:7000/predict",
          {
            current_stock:
              normalizedCurrentStock,
            avg_daily_sales:
              adjustedDailySales,
            days_remaining:
              adjustedDaysRemaining,
            trend_percent:
              normalizedTrendPercent +
              normalizedDemandIncrease,
          }
        );

      let predictedDemand = Number(
        mlResponse.data
          .predicted_30_day_demand || 0
      );

      if (adjustedDailySales === 0) {
        predictedDemand = 0;
      }

      const suggestedRestock = Math.max(
        0,
        predictedDemand -
          normalizedCurrentStock
      );

      let risk = "Low";

      if (adjustedDaysRemaining <= 7) {
        risk = "High";
      } else if (
        adjustedDaysRemaining <= 20
      ) {
        risk = "Medium";
      }

      return res.json({
        success: true,
        simulation: {
          adjustedDailySales: Number(
            adjustedDailySales.toFixed(2)
          ),
          adjustedDaysRemaining,
          predictedDemand,
          suggestedRestock,
          risk,
          forecastSource:
            "Scenario + ML Random Forest",
        },
      });
    } catch (error) {
      console.error(
        "Scenario Simulation Error:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to run scenario simulation.",
      });
    }
  }
);

/* =========================================================
   START SERVER
========================================================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server Running On Port ${PORT}`
  );
});