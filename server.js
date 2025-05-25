const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// ✅ Middleware
app.use(cors()); // Allow requests from all origins
app.use(express.json()); // Parse JSON request bodies

// ✅ Serve static images from /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Routes
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/products', productRoutes); // Product CRUD
app.use('/api/auth', authRoutes);        // Login/Register

// ✅ Health check route (optional)
app.get('/', (req, res) => {
  res.send('🚀 Backend API is running');
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
