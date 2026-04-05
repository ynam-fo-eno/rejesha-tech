const express = require('express');
const router = express.Router();

// Import the logic from your auth controller
const authController = require('../controllers/authController');

// POST /api/auth/register
// Purpose: Receives new user details and saves them to MySQL
router.post('/register', authController.register);

// POST /api/auth/login
// Purpose: Verifies credentials and generates a JWT token for the session
router.post('/login', authController.login);

module.exports = router;


