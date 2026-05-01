const db = require('../db/connection');
const cloudinary = require('../config/cloudinary');
const User = require('../models/userModel');



exports.getTechnicians = async (req, res) => {
    try {
        const technicians = await User.getTechnicians();
        res.status(200).json(technicians);
    } catch (error) {
        console.error("Error fetching technicians:", error);
        res.status(500).json({ error: "Failed to load technician list" });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProfilePicture = async (req, res) => {
  // 1. Get the secure ID from the token (injected by authMiddleware)
  const userId = req.user.id; 

  // 2. Get the actual image data from the body
  const { imageBase64 } = req.body; 

  try {
    // Check if the image actually arrived
    if (!imageBase64) {
      return res.status(400).json({ error: "No image data provided" });
    }

    // 3. Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(imageBase64, {
      folder: 'rejesha_profiles',
    });
    
    const imageUrl = uploadResponse.secure_url;

    // 4. Save to Aiven
    await db.execute(
      'UPDATE users SET image_url = ? WHERE id = ?', 
      [imageUrl, userId]
    );

      const [rows] = await db.execute(
      "SELECT id, fName, lName, username, email, role1, role2, image_url FROM users WHERE id = ?",
      [userId]
    );

    const updatedUser = rows[0];

    return res.status(200).json({ 
      message: "Profile picture updated", 
      user: updatedUser // Send the WHOLE user back!
    });
    

  } catch (error) {
    console.error("DP Update Error:", error);
    res.status(500).json({ error: "Failed to update profile picture" });
  }
};



