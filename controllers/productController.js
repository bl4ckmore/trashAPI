const pool = require('../db');

// GET /products
exports.getAllProducts = async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
  res.json(rows);
};

// GET /products/:id
exports.getProductById = async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
  if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });
  res.json(rows[0]);
};

// POST /products
exports.createProduct = async (req, res) => {
  const { name, description, price, stock, image_url, category } = req.body;
  const result = await pool.query(
    `INSERT INTO products (name, description, price, stock, image_url, category)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [name, description, price, stock, image_url, category]
  );
  res.status(201).json(result.rows[0]);
};

// PUT /products/:id
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, image_url, category } = req.body;
  const result = await pool.query(
    `UPDATE products SET name = $1, description = $2, price = $3, stock = $4,
     image_url = $5, category = $6 WHERE id = $7 RETURNING *`,
    [name, description, price, stock, image_url, category, id]
  );
  if (result.rowCount === 0) return res.status(404).json({ error: 'Product not found' });
  res.json(result.rows[0]);
};

// DELETE /products/:id
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
  if (result.rowCount === 0) return res.status(404).json({ error: 'Product not found' });
  res.json({ message: 'Product deleted successfully' });
};
