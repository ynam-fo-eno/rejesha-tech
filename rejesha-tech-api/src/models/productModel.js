const db = require('../db/connection');

const Product = {
  create: async (data) => {
    const query = `
      INSERT INTO products (pName, pAbout, price, category, image_url, stock_qty, fundi_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      data.pName, 
      data.pAbout, 
      data.price, 
      data.category, 
      data.image_url, 
      data.stock_qty || 1, 
      data.fundi_id
    ];
    return await db.execute(query, values);
  },

  getAll: async () => {
    // This JOIN pulls the username from the 'users' table 
    // based on the 'fundi_id' in the 'products' table.
    const query = `
      SELECT p.*, u.username AS fundi_name 
      FROM products p 
      LEFT JOIN users u ON p.fundi_id = u.id 
      ORDER BY p.created_at DESC
    `;
    const [rows] = await db.execute(query);
    return rows;
  }


};

module.exports = Product;