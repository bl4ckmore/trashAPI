const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");
const path = require("path");

// ✅ Multer storage config (move to top-level)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });


// ✅ GET all products
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Fetch products error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ GET product by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Fetch single product error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ CREATE new product (with image upload)
router.post("/", upload.single('image'), async (req, res) => {
  const { name, description, price, stock, category } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const result = await pool.query(
      `INSERT INTO products (name, description, price, stock, image_url, category)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, description, price, stock, image_url, category]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Create product error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ UPDATE product (with optional new image)
router.put("/:id", upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, category } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : req.body.image_url;

  try {
    const result = await pool.query(
      `UPDATE products
       SET name = $1, description = $2, price = $3, stock = $4, image_url = $5, category = $6
       WHERE id = $7
       RETURNING *`,
      [name, description, price, stock, image_url, category, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ DELETE product
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM products WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
