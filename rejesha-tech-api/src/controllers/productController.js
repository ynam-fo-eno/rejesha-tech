const Product = require('../models/productModel');
const cloudinary = require('../config/cloudinary');

// It shall be noted that we handle the Cloudinary upload heavily on the backend. 
// This prevents exposing our secure upload preset on the frontend, ensuring malicious 
// actors cannot bloat our cloud storage.
exports.listNewProduct = async (req, res) => {
  const { pName, pAbout, price, category, stock_qty, imageBase64, fundi_id } = req.body;

  try {
    const uploadResult = await cloudinary.uploader.upload(imageBase64, {
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
    });

    const newProductData = {
      pName,
      pAbout,
      price,
      category,
      image_url: uploadResult.secure_url, 
      stock_qty,
      fundi_id
    };

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

// This acts as our safety mechanism for the 'Delete One' functionality, 
// pulling the name sent by the frontend and relying on the model to execute 
// the actual SQL removal.
exports.deleteOneProduct = async (req, res) => {
  const { pName } = req.body;
  
  if (!pName) {
    return res.status(400).json({ error: "Product name required for deletion." });
  }

  try {
    await Product.deleteByName(pName);
    res.json({ success: true, message: `Product ${pName} deleted.` });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ error: "Could not delete the product." });
  }
};

// Mysteriously executing a full table wipe is usually dangerous, but because 
// it involves only our dummy table for testing the 'Tunaanza Upya' feature, 
// we allow a direct truncation here.
exports.resetDummyProducts = async (req, res) => {
  try {
    await Product.resetDummy();
    res.json({ success: true, message: "Tunaanza Upya! Dummy data wiped." });
  } catch (error) {
    console.error("Reset Error:", error);
    res.status(500).json({ error: "Could not reset dummy products." });
  }
};