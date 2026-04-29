const db = require('../db/connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    // 1. Grab the exact names your React Native frontend is sending
    const { fName, lName, username, email, password, role1, role2 } = req.body; 
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // 2. Map them to your new MySQL column names (pword, role1, role2)
        const [result] = await db.execute(
            "INSERT INTO users (fName, lName, username, email, pword, role1, role2) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [fName, lName, username, email, hashedPassword, role1, role2]
        );
        res.status(201).json({ message: "User registered!", userId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const [users] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);
        if (users.length === 0) return res.status(404).json({ message: "User not found" });

        // 3. Compare the typed password with the 'pword' column from Aiven
        const validPass = await bcrypt.compare(password, users[0].pword);
        if (!validPass) return res.status(401).json({ message: "Invalid credentials" });

        // 4. Include both roles in the JWT token so the frontend knows what screens to show
        const token = jwt.sign(
            { 
                id: users[0].id, 
                role1: users[0].role1, 
                role2: users[0].role2 
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );
        
       res.json({ 
            token, 
            user: { 
                id: users[0].id, 
                fName: users[0].fName,       // Added
                lName: users[0].lName,       // Added
                username: users[0].username, 
                email: users[0].email,       // Added
                role1: users[0].role1,
                role2: users[0].role2,
                image_url: users[0].image_url // THE BIG ONE!
            } 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};