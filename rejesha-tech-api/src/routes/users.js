const express = require('express');
const router = express.Router();

// Import the logic from your user controller
const userController = require('../controllers/userController');

// Import the middleware that checks if the user is logged in
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/users/profile
// Purpose: Retrieves the profile data of the currently logged-in user
// Security: The authMiddleware runs first to ensure the token is valid
router.get('/profile', authMiddleware, userController.getProfile);

//To permit a user to update their profile pic
router.post('/update-dp',authMiddleware, userController.updateProfilePicture);

module.exports = router;