const db = require('../db/connection');

const User = {
  // 1. For the Login Logic
  findByUsername: (username, callback) => {
    return db.query("SELECT * FROM users WHERE username = ?", [username], callback);
  },

  // 2. For the Repairs Popup (Feature 2)
  getTechnicians: (callback) => {
    return db.query(
      "SELECT id, username, fName, lName FROM users WHERE role1 = 'Technician'", 
      callback
    );
  },

  // 3. For Registration
  create: (userData, callback) => {
    const query = `
      INSERT INTO users (fName, lName, username, email, pword, role1, role2) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    return db.query(query, [
      userData.fName, 
      userData.lName, 
      userData.username, 
      userData.email, 
      userData.password, 
      userData.role1, 
      userData.role2
    ], callback);
  },

  // 4. For Profile Pages
  findById: (id, callback) => {
    return db.query("SELECT id, fName, lName, username, email, role1 FROM users WHERE id = ?", [id], callback);
  }
};

module.exports = User;