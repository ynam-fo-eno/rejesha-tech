const db = require('../db/connection');

const User = {
    // 1. Used in authController.js login
    findByUsername: async (username) => {
        const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);
        return rows[0];
    },

    // 2. Used for the Technician selection popup
    getTechnicians: async () => {
        const [rows] = await db.execute(
            "SELECT id, username, fName, lName FROM users WHERE role1 = 'Technician'"
        );
        return rows;
    },

    // 3. Used in Registration
    create: async (userData) => {
        const query = `
            INSERT INTO users (fName, lName, username, email, pword, role1, role2) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const values = [
            userData.fName, userData.lName, userData.username, 
            userData.email, userData.password, userData.role1, userData.role2
        ];
        return await db.execute(query, values);
    },

    // 4. Used for Profile pages
    findById: async (id) => {
        const [rows] = await db.execute(
            "SELECT id, fName, lName, username, email, role1, image_url FROM users WHERE id = ?", 
            [id]
        );
        return rows[0];
    }
};

module.exports = User;