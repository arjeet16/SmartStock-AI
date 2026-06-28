require("dotenv").config();
console.log("SERVER FILE LOADED");
const db = require("./config/db");
const express = require("express");
const cors = require("cors");

const app = express();

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
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server Running On Port ${PORT}`);
});