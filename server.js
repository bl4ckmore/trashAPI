const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
