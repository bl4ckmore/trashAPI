// db.js


const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://admin:tYU2fxAqxu0Bw8TojocShwpBCGNUKiDR@dpg-d0o9m1be5dus73b989ug-a.oregon-postgres.render.com/master_qxse",
  ssl: { rejectUnauthorized: false },
});

// ✅ Test Connection on Startup
pool.connect()
  .then(() => console.log("✅ PostgreSQL connected successfully!"))
  .catch((err) => console.error("❌ PostgreSQL connection failed:", err));

module.exports = pool;
