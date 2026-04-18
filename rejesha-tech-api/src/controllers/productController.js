const Product = require('../models/productModel');
const cloudinary = require('../config/cloudinary');

exports.listNewProduct = async (req, res) => {
  const { pName, pAbout, price, category, stock_qty, imageBase64, fundi_id } = req.body;

  try {
    // 1. Upload to Cloudinary using your 'rejesha_tech_products' preset
    const uploadResult = await cloudinary.uploader.upload(imageBase64, {
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
    });

    // 2. Prepare data for MySQL
    const newProductData = {
      pName,
      pAbout,
      price,
      category,
      image_url: uploadResult.secure_url, // The Cloudinary link
      stock_qty,
      fundi_id
    };

    // 3. Save to Aiven via the Model
    await Product.create(newProductData);

    res.status(201).json({ 
      success: true, 
      message: "Product listed successfully on Rejesha Tech!",
      url: uploadResult.secure_url 
    });

  } catch (error) {
    console.error("Listing Error:", error);
    res.status(500).json({ success: false, message: "Server error during upload" });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.getAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch products" });
  }
};