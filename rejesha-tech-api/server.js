const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Allows Node to read the JSON sent from React Native

// Routes
const authRoutes = require('./src/routes/auth');
app.use('/api/auth', authRoutes); // This makes your endpoints: http://[YOUR_IP]:3000/api/auth/login

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});