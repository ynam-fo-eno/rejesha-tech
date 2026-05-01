const db = require('../db/connection');

const Repair = {
    create: async (repairData) => {
        // Sequenced to match image_4d0654.png physical DB order
        const query = `
            INSERT INTO repairs 
            (fundi_id, image_url, issue_description, latitude, longitude, village_name, landmark) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`;
        
        const values = [
            repairData.fundi_id,
            repairData.image_url,
            repairData.issue_description,
            repairData.latitude,
            repairData.longitude,
            repairData.village_name,
            repairData.landmark
        ];
        
        return await db.execute(query, values);
    },

    getByTechnician: async (fundi_id) => {
        const query = "SELECT * FROM repairs WHERE fundi_id = ? ORDER BY created_at DESC";
        const [rows] = await db.execute(query, [fundi_id]);
        return rows;
    }
};

module.exports = Repair;