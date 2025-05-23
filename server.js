const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const pdfRoutes = require("./routes/pdfRoutes");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middlewares/authMiddleware");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());

app.use("/api/auth", authRoutes);
app.use("/api/pdf", pdfRoutes);

app.get("/api/user/dashboard", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const userResult = await pool.query("SELECT id, name, email, role FROM users WHERE id = $1", [userId]);
    const user = userResult.rows[0];
    const historyResult = await pool.query("SELECT * FROM pdf_logs WHERE user_id = $1 ORDER BY created_at DESC", [userId]);

    res.json({ user, history: historyResult.rows });
  } catch (err) {
    console.error("❌ Dashboard Error:", err);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
});

app.get("/pdf/:filename", (req, res) => {
  const filePath = `${__dirname}/updated_pdfs/${req.params.filename}`;
  res.download(filePath, (err) => {
    if (err) return res.status(404).json({ message: "File not found" });
  });
});

app.get("/", (req, res) => res.send("🔥 PDF API is running!"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
