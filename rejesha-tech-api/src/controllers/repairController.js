const Repair = require('../models/repairModel');

exports.handleRepairRequest = async (req, res) => {
  const { fundi_id, image_url, issue_description, latitude, longitude, village_name, landmark, client_id,ai_thoughts } = req.body;

  // 1. Strict Validation Check
  if (!fundi_id || !issue_description || !village_name || !landmark) {
    return res.status(400).json({ message: "All fields are required to help the technician find you!" });
  }

  // 2. Data Formatting
  const newRepair = {
    fundi_id,
    image_url, 
    issue_description,
    latitude: latitude || null,
    longitude: longitude || null,
    village_name,
    landmark,
    client_id,
    ai_thoughts
  };

  // 3. Database Execution (Modernized)
  try {
    const [result] = await Repair.create(newRepair);
    res.status(201).json({ message: "Repair request logged successfully!", repairId: result.insertId });
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).json({ error: "Could not save repair request." });
  }
};

exports.getTechnicianRepairs = async (req, res) => {
  const { fundi_id } = req.params;

  try {
    const results = await Repair.getByTechnician(fundi_id);
    res.status(200).json(results);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch your assigned repairs." });
  }
};