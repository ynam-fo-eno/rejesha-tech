const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// This "Door" leads to the "listNewProduct" function in your controller
router.post('/list', productController.listNewProduct);

// This "Door" lets you fetch all products for your app's home screen
router.get('/all', productController.getProducts);

// For product mgmt
router.post('/add', productController.listNewProduct);
router.delete('/delete_one', productController.deleteOneProduct);
router.delete('/reset_dummy', productController.resetDummyProducts);

module.exports = router;