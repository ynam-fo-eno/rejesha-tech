const Repair = require('../models/repairModel');

exports.handleRepairRequest = (req, res) => {
  const { fundi_id, image_url,issue_description,  latitude, longitude,village_name, landmark, } = req.body;

  // 1. Strict Validation Check
  if (!fundi_id || !issue_description || !village_name || !landmark) {
    return res.status(400).json({ message: "All fields are required to help the technician find you." });
  }

  // 2. Data Formatting
  const newRepair = {
    fundi_id,
    image_url, // This will be the Cloudinary/Firebase link from your frontend
    issue_description:issue_description,
    latitude: latitude || null, 
    longitude: longitude || null,
    village_name,
    landmark
  };

  // 3. Database Execution
  Repair.create(newRepair, (err, result) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: "Could not save repair request." });
    }
    res.status(201).json({ message: "Repair request logged successfully!", repairId: result.insertId });
  });
};

exports.getTechnicianRepairs = (req, res) => {
  const { fundi_id } = req.params;

  Repair.getByTechnician(fundi_id, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch your assigned repairs." });
    }
    res.status(200).json(results);
  });
};