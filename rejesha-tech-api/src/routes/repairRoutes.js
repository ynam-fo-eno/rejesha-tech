const express = require('express');
const router = express.Router();
const repairController = require('../controllers/repairController');

// 1. Client submits a request
router.post('/submit', repairController.handleRepairRequest);

// 2. Technician fetches their list 
// FIXED: Removed the ':' from 'my-repairs' so it's a literal path
router.get('/my-repairs/:fundi_id', repairController.getTechnicianRepairs);

module.exports = router;