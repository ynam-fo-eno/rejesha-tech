const express = require('express');
const cors = require('cors');
require('dotenv').config();


//Express has methods for handling various dataypes
//that header of the JSON body could receive more 
// easily than existing Node.js methods would.
const app = express();

// This block comprises all the collections of routes each routing page has.
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/users');
const productRoutes = require('./src/routes/productRoutes');
const repairRoutes = require('./src/routes/repairRoutes');


// MIDDLEWARE (The "Bouncers")
app.use(cors());

// Expanded limits to allow for base64 profile photos
//and just any photos a user can upload generally.
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// REGISTER ROUTES (The "Switchboard")
// This tells the server: "If a request starts with X, use this route file."
app.use('/api/auth', authRoutes);       // Handles login/register
app.use('/api/users', userRoutes);      // Handles profile/DP updates
app.use('/api/products', productRoutes); // Handles the marketplace
app.use('/api/repairs', repairRoutes); //For repairs page

// Health Check for Render server
app.get('/', (req, res) => {
  res.send("Rejesha Tech API is Online and Operational!");
});

// Points to either Aiven's port (10926 in our case) or 5000.
//Can also be changed to 5000 with minimal issue but best to 
// match the OG port of Render's web service.
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Local Address: http://localhost:${PORT}`);
});