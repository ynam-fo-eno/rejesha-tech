const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// This "Door" leads to the "listNewProduct" function in your controller
router.post('/list', productController.listNewProduct);

// This "Door" lets you fetch all products for your app's home screen
router.get('/all', productController.getProducts);

module.exports = router;