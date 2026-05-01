const db = require('../db/connection');

const Repair = {
  create: (repairData, callback) => {
    const query = `
      INSERT INTO repairs 
      (fundi_id, image_url, issue_description, village_name, landmark, latitude, longitude) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      repairData.fundi_id,
      repairData.image_url,
      repairData.issue_description,
      repairData.village_name, // Position 4
      repairData.landmark,     // Position 5
      repairData.latitude,     // Position 6
      repairData.longitude     // Position 7
    ];

    return db.query(query, values, callback);
  },

  getByTechnician: (fundi_id, callback) => {
    const query = "SELECT * FROM repairs WHERE fundi_id = ? ORDER BY created_at DESC";
    return db.query(query, [fundi_id], callback);
  }
};

module.exports = Repair;