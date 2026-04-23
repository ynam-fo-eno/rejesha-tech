const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. IMPORT ROUTES (The "Brains" of the app)
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/users');
const productRoutes = require('./src/routes/productRoutes');

// 2. MIDDLEWARE (The "Bouncers")
app.use(cors());

// Expanded limits to allow for base64 profile photos
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 3. REGISTER ROUTES (The "Switchboard")
// This tells the server: "If a request starts with X, use this route file."
app.use('/api/auth', authRoutes);       // Handles login/register
app.use('/api/users', userRoutes);      // Handles profile/DP updates
app.use('/api/products', productRoutes); // Handles the marketplace

// Health Check
app.get('/', (req, res) => {
  res.send("Rejesha Tech API is Online and Operational!");
});

// 4. START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  console.log(` Local Address: http://localhost:${PORT}`);
});