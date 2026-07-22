require("dotenv").config();

console.log("SERVER FILE LOADED");

const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
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

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (
        !origin ||
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }

      return callback(
        new Error("Origin not allowed by CORS.")
      );
    },
    credentials: true,
  })
);
app.use(express.json());
const mailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure:
    String(process.env.SMTP_SECURE).toLowerCase() === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const createAuthToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization || "";

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : "";

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired session.",
    });
  }
};
const ML_SERVICE_URL =
  process.env.ML_SERVICE_URL ||
  "http://localhost:7000";
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
app.get("/products", authenticateUser, (req, res) => {
  const userId = Number(req.user.id);

  const sql = `
    SELECT *
    FROM stock_items
    WHERE user_id = ?
    ORDER BY id DESC
  `;

  db.query(sql, [userId], (error, results) => {
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
// ADD PRODUCT
app.post("/products", authenticateUser, (req, res) => {
  const {
    item_name,
    category,
    quantity,
    units_per_carton,
    buying_price,
    selling_price,
  } = req.body;

  const userId = Number(req.user.id);

  const cleanItemName = String(item_name || "").trim();
  const cleanCategory = String(category || "").trim();

  const normalizedQuantity = Number(quantity);
  const normalizedUnitsPerCarton = Number(units_per_carton);
  const normalizedBuyingPrice = Number(buying_price);
  const normalizedSellingPrice = Number(selling_price);

  if (
    !cleanItemName ||
    !cleanCategory ||
    !Number.isInteger(normalizedQuantity) ||
    normalizedQuantity < 0 ||
    !Number.isInteger(normalizedUnitsPerCarton) ||
    normalizedUnitsPerCarton <= 0 ||
    !Number.isFinite(normalizedBuyingPrice) ||
    normalizedBuyingPrice < 0 ||
    !Number.isFinite(normalizedSellingPrice) ||
    normalizedSellingPrice < 0
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Please provide valid product details. Units per carton must be greater than 0.",
    });
  }

  const sql = `
    INSERT INTO stock_items
    (
      user_id,
      item_name,
      category,
      quantity,
      units_per_carton,
      buying_price,
      selling_price
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      userId,
      cleanItemName,
      cleanCategory,
      normalizedQuantity,
      normalizedUnitsPerCarton,
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
        product: {
          id: result.insertId,
          item_name: cleanItemName,
          category: cleanCategory,
          quantity: normalizedQuantity,
          units_per_carton: normalizedUnitsPerCarton,
          buying_price: normalizedBuyingPrice,
          selling_price: normalizedSellingPrice,
        },
      });
    }
  );
});
// UPDATE PRODUCT
app.put("/products/:id", authenticateUser, (req, res) => {
  const { id } = req.params;
  const userId = Number(req.user.id);

  const {
    item_name,
    category,
    quantity,
    units_per_carton,
    buying_price,
    selling_price,
  } = req.body;

  const cleanItemName = String(item_name || "").trim();
  const cleanCategory = String(category || "").trim();

  const normalizedQuantity = Number(quantity);
  const normalizedUnitsPerCarton = Number(units_per_carton);
  const normalizedBuyingPrice = Number(buying_price);
  const normalizedSellingPrice = Number(selling_price);

  if (
    !cleanItemName ||
    !cleanCategory ||
    !Number.isInteger(normalizedQuantity) ||
    normalizedQuantity < 0 ||
    !Number.isInteger(normalizedUnitsPerCarton) ||
    normalizedUnitsPerCarton <= 0 ||
    !Number.isFinite(normalizedBuyingPrice) ||
    normalizedBuyingPrice < 0 ||
    !Number.isFinite(normalizedSellingPrice) ||
    normalizedSellingPrice < 0
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Please provide valid product details. Units per carton must be greater than 0.",
    });
  }

  const sql = `
    UPDATE stock_items
    SET
      item_name = ?,
      category = ?,
      quantity = ?,
      units_per_carton = ?,
      buying_price = ?,
      selling_price = ?
    WHERE id = ?
      AND user_id = ?
  `;

  db.query(
    sql,
    [
      cleanItemName,
      cleanCategory,
      normalizedQuantity,
      normalizedUnitsPerCarton,
      normalizedBuyingPrice,
      normalizedSellingPrice,
      id,
      userId,
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
app.put(
  "/products/edit/:id",
  authenticateUser,
  (req, res) => {
    const { id } = req.params;
    const userId = Number(req.user.id);

    const {
      item_name,
      category,
      quantity,
      units_per_carton,
      buying_price,
      selling_price,
    } = req.body;

    const cleanItemName = String(item_name || "").trim();
    const cleanCategory = String(category || "").trim();

    const normalizedQuantity = Number(quantity);
    const normalizedUnitsPerCarton = Number(units_per_carton);
    const normalizedBuyingPrice = Number(buying_price);
    const normalizedSellingPrice = Number(selling_price);

    if (
      !cleanItemName ||
      !cleanCategory ||
      !Number.isInteger(normalizedQuantity) ||
      normalizedQuantity < 0 ||
      !Number.isInteger(normalizedUnitsPerCarton) ||
      normalizedUnitsPerCarton <= 0 ||
      !Number.isFinite(normalizedBuyingPrice) ||
      normalizedBuyingPrice < 0 ||
      !Number.isFinite(normalizedSellingPrice) ||
      normalizedSellingPrice < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide valid product details. Units per carton must be greater than 0.",
      });
    }

    const sql = `
      UPDATE stock_items
      SET
        item_name = ?,
        category = ?,
        quantity = ?,
        units_per_carton = ?,
        buying_price = ?,
        selling_price = ?
      WHERE id = ?
        AND user_id = ?
    `;

    db.query(
      sql,
      [
        cleanItemName,
        cleanCategory,
        normalizedQuantity,
        normalizedUnitsPerCarton,
        normalizedBuyingPrice,
        normalizedSellingPrice,
        id,
        userId,
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
  }
);
// DELETE PRODUCT
app.delete("/products/:id", authenticateUser, (req, res) => {
  const { id } = req.params;
  const userId = Number(req.user.id);
  const sql = `
    DELETE FROM stock_items
WHERE id = ?
  AND user_id = ?
  `;

  db.query(sql, [id, userId], (error, result) => {
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

// SELL PRODUCT BY UNITS OR CARTONS
app.post("/sell", authenticateUser, (req, res) => {
  const {
    product_id,
    quantity,
    sell_type,
    quantity_sold,
  } = req.body;

  const userId = Number(req.user.id);
  const normalizedProductId = Number(product_id);

  // Backward compatibility:
  // old frontend may still send quantity_sold only
  const requestedQuantity = Number(
    quantity ?? quantity_sold
  );

  const normalizedSellType =
    String(sell_type || "unit")
      .trim()
      .toLowerCase();

  if (
    !Number.isInteger(normalizedProductId) ||
    normalizedProductId <= 0 ||
    !Number.isInteger(requestedQuantity) ||
    requestedQuantity <= 0 ||
    !["unit", "carton"].includes(normalizedSellType)
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Please provide a valid product, quantity and sell type.",
    });
  }

  const getProductSql = `
    SELECT *
    FROM stock_items
    WHERE id = ?
      AND user_id = ?
    LIMIT 1
  `;

  db.query(
    getProductSql,
    [normalizedProductId, userId],
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

      const availableQuantity = Number(
        product.quantity || 0
      );

      const unitsPerCarton = Math.max(
        1,
        Number(product.units_per_carton || 1)
      );

      const totalUnitsToSell =
        normalizedSellType === "carton"
          ? requestedQuantity * unitsPerCarton
          : requestedQuantity;

      if (availableQuantity < totalUnitsToSell) {
        const availableCartons = Math.floor(
          availableQuantity / unitsPerCarton
        );

        const remainingUnits =
          availableQuantity % unitsPerCarton;

        return res.status(400).json({
          success: false,
          message:
            normalizedSellType === "carton"
              ? `Insufficient stock. Available stock is ${availableCartons} cartons and ${remainingUnits} units.`
              : `Insufficient stock. Only ${availableQuantity} units are available.`,
        });
      }

      const newQuantity =
        availableQuantity - totalUnitsToSell;

      const buyingPrice = Number(
        product.buying_price || 0
      );

      const sellingPrice = Number(
        product.selling_price || 0
      );

      const profit =
        totalUnitsToSell *
        (sellingPrice - buyingPrice);

      const updateStockSql = `
        UPDATE stock_items
        SET quantity = ?
        WHERE id = ?
          AND user_id = ?
      `;

      db.query(
        updateStockSql,
        [
          newQuantity,
          normalizedProductId,
          userId,
        ],
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
              user_id,
              product_id,
              quantity_sold,
              selling_price,
              profit
            )
            VALUES (?, ?, ?, ?, ?)
          `;

          db.query(
            saleSql,
            [
              userId,
              normalizedProductId,
              totalUnitsToSell,
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

              const remainingCartons =
                Math.floor(
                  newQuantity / unitsPerCarton
                );

              const remainingLooseUnits =
                newQuantity % unitsPerCarton;

              return res.status(201).json({
                success: true,
                message:
                  "Sale Recorded Successfully",
                sale_id: saleResult.insertId,

                sell_type: normalizedSellType,
                requested_quantity:
                  requestedQuantity,

                units_per_carton:
                  unitsPerCarton,

                total_units_sold:
                  totalUnitsToSell,

                remaining_quantity:
                  newQuantity,

                remaining_stock: {
                  cartons: remainingCartons,
                  units: remainingLooseUnits,
                  display: `${remainingCartons} cartons + ${remainingLooseUnits} units`,
                },

                profit,
              });
            }
          );
        }
      );
    }
  );
});
/* =========================================================
   SALES HISTORY
========================================================= */

app.get("/sales", authenticateUser, (req, res) => {
  const userId = Number(req.user.id);

  const sql = `
    SELECT
      s.id,
      s.product_id,
      p.item_name,
      s.quantity_sold,
      s.selling_price,
      s.profit,
      s.created_at
    FROM sales s
    LEFT JOIN stock_items p
      ON s.product_id = p.id
      AND p.user_id = s.user_id
    WHERE s.user_id = ?
    ORDER BY s.created_at DESC, s.id DESC
  `;

  db.query(sql, [userId], (error, results) => {
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
// FORGOT PASSWORD
app.post("/forgot-password", async (req, res) => {
  try {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required.",
      });
    }

    const [users] = await db.promise().query(
      `
        SELECT id, full_name, email
        FROM users
        WHERE LOWER(email) = ?
        LIMIT 1
      `,
      [email]
    );

    /*
      Return the same message even if the user does not exist.
      This avoids revealing which emails are registered.
    */
    if (users.length === 0) {
      return res.json({
        success: true,
        message:
          "If an account exists for this email, a reset link has been sent.",
      });
    }

    const user = users[0];

    const resetToken = crypto
      .randomBytes(32)
      .toString("hex");

    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const resetTokenExpires = new Date(
      Date.now() + 15 * 60 * 1000
    );

    await db.promise().query(
      `
        UPDATE users
        SET
          reset_token_hash = ?,
          reset_token_expires = ?
        WHERE id = ?
      `,
      [
        resetTokenHash,
        resetTokenExpires,
        user.id,
      ]
    );

    const frontendUrl =
      process.env.FRONTEND_URL ||
      "http://localhost:5173";

    const resetUrl =
      `${frontendUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(
        user.email
      )}`;

    await mailTransporter.sendMail({
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: "Reset your SmartStock AI password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2 style="color: #2563eb;">SmartStock AI</h2>

          <p>Hello ${user.full_name || "User"},</p>

          <p>
            We received a request to reset your password.
          </p>

          <p>
            Click the button below to create a new password.
            This link will expire in 15 minutes.
          </p>

          <p style="margin: 30px 0;">
            <a
              href="${resetUrl}"
              style="
                display: inline-block;
                padding: 14px 22px;
                background: #2563eb;
                color: #ffffff;
                text-decoration: none;
                border-radius: 10px;
                font-weight: 700;
              "
            >
              Reset Password
            </a>
          </p>

          <p>
            If you did not request this, you can safely ignore this email.
          </p>

          <p style="color: #64748b; font-size: 13px;">
            SmartStock AI Security Team
          </p>
        </div>
      `,
    });

    return res.json({
      success: true,
      message:
        "If an account exists for this email, a reset link has been sent.",
    });
  } catch (error) {
    console.error(
      "FORGOT PASSWORD ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to process password reset request.",
      error: error.message,
    });
  }
});
// RESET PASSWORD
app.post("/reset-password", async (req, res) => {
  try {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();

    const token = String(req.body.token || "").trim();
    const newPassword = String(
      req.body.new_password || ""
    );
    const confirmPassword = String(
      req.body.confirm_password || ""
    );

    if (
      !email ||
      !token ||
      !newPassword ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 8 characters.",
      });
    }

    const resetTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const [users] = await db.promise().query(
      `
        SELECT
          id,
          reset_token_expires
        FROM users
        WHERE LOWER(email) = ?
          AND reset_token_hash = ?
        LIMIT 1
      `,
      [email, resetTokenHash]
    );

    if (users.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Reset link is invalid or has already been used.",
      });
    }

    const user = users[0];

    if (
      !user.reset_token_expires ||
      new Date(user.reset_token_expires).getTime() <
        Date.now()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Reset link has expired. Request a new one.",
      });
    }

    const passwordHash = await bcrypt.hash(
      newPassword,
      12
    );

    await db.promise().query(
      `
        UPDATE users
        SET
          password_hash = ?,
          reset_token_hash = NULL,
          reset_token_expires = NULL
        WHERE id = ?
      `,
      [passwordHash, user.id]
    );

    return res.json({
      success: true,
      message:
        "Password reset successfully. You can now sign in.",
    });
  } catch (error) {
    console.error(
      "RESET PASSWORD ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to reset password.",
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
    const token = createAuthToken(user);
      return res.status(200).json({
  success: true,
  message: "Login successful.",
  token,
  user: {
    id: user.id,
    full_name: user.full_name,
    company_name: user.company_name,
    email: user.email,
    mobile_number: user.mobile_number,
    role: user.role || "Administrator",
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
        const token = createAuthToken({
  id: 2,
  email: "admin@smartstock.local",
  role: "Administrator",
});
        return res.status(200).json({
  success: true,
  message: "Login successful.",
  token,
  user: {
    id: 2,
    full_name: "admin",
    company_name: "SmartStock AI",
    email: "admin@smartstock.local",
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

app.post("/ai-report", authenticateUser, async (req, res) => {
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

app.post("/ai-chat", authenticateUser, async (req, res) => {
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

app.get("/forecast", authenticateUser, async (req, res) => {
  try {
    const userId = Number(req.user.id);

    const [products] = await db.promise().query(
      `
        SELECT *
        FROM stock_items
        WHERE user_id = ?
      `,
      [userId]
    );

    const [sales] = await db.promise().query(
      `
        SELECT *
        FROM sales
        WHERE user_id = ?
      `,
      [userId]
    );

    let forecast = calculateForecast(products, sales);

    forecast = await Promise.all(
      forecast.map(async (item) => {
        try {
          const mlResponse = await axios.post(
            `${ML_SERVICE_URL}/predict`,
            {
              current_stock: item.currentStock,
              avg_daily_sales: item.averageDailySales,
              days_remaining: item.daysRemaining,
              trend_percent: item.trendPercent,
            }
          );

          let mlPrediction = Number(
            mlResponse.data.predicted_30_day_demand || 0
          );

          if (Number(item.averageDailySales) === 0) {
            mlPrediction = 0;
          }

          const mlRecommendedRestock = Math.max(
            0,
            mlPrediction - Number(item.currentStock)
          );

          const businessExplanation = [];

          if (Number(item.averageDailySales) === 0) {
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
            mlForecast30Days: mlPrediction,
            mlRecommendedRestock,
            forecastSource: "ML Random Forest",
            predictionExplanation: mlResponse.data.explanation,
            businessExplanation,
          };
        } catch (error) {
          console.error(
            "ML FORECAST FALLBACK:",
            error.message
          );

          return {
            ...item,
            mlForecast30Days: item.forecast30Days,
            mlRecommendedRestock: item.recommendedRestock,
            forecastSource: "Rule Based Fallback",
          };
        }
      })
    );

    return res.json({
      success: true,
      forecast,
    });
  } catch (error) {
    console.error("FORECAST ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* =========================================================
   ML MODEL METRICS
========================================================= */

app.get("/ml-metrics", authenticateUser, async (req, res) => {
  try {
    const response = await axios.get(
      `${ML_SERVICE_URL}/metrics`
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
  authenticateUser,
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
          `${ML_SERVICE_URL}/predict`,
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
  authenticateUser,
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
          `${ML_SERVICE_URL}/predict`,
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
mailTransporter
  .verify()
  .then(() => {
    console.log("✅ SMTP mail server connected successfully.");
  })
  .catch((error) => {
    console.error("❌ SMTP connection failed:");
    console.error(error.message);
  });
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server Running On Port ${PORT}`);
});