const db = require('../db/connection');

const Repair = {
    create: async (repairData) => {
        // Sequenced to match image_4d0654.png physical DB order
        const query = `
            INSERT INTO repairs 
            (fundi_id, image_url, issue_description, latitude, longitude, village_name, landmark,client_id,ai_thoughts) 
            VALUES (?, ?, ?, ?, ?, ?, ?,?,?)`;
        
        const values = [
            repairData.fundi_id,
            repairData.image_url,
            repairData.issue_description,
            repairData.latitude,
            repairData.longitude,
            repairData.village_name,
            repairData.landmark,
            repairData.client_id,
            repairData.ai_thoughts,



        ];
        
        return await db.execute(query, values);
    },

    getByTechnician: async (fundi_id) => {
        const query = `
            SELECT r.*, u.username AS client_name 
            FROM repairs r 
            LEFT JOIN users u ON r.client_id = u.id 
            WHERE r.fundi_id = ? 
            ORDER BY r.created_at DESC`;
        const [rows] = await db.execute(query, [fundi_id]);
        return rows;
    }
};

module.exports = Repair;