const db = require('../db/connection');

exports.getProfile = async (req, res) => {
    try {
        const [user] = await db.execute("SELECT id, fName, lName, username, email, role FROM users WHERE id = ?", [req.user.id]);
        res.json(user[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};