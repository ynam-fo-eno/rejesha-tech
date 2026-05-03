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
    const query = `
      SELECT p.*, u.username AS fundi_name 
      FROM products p 
      LEFT JOIN users u ON p.fundi_id = u.id 
      ORDER BY p.created_at DESC
    `;
    const [rows] = await db.execute(query);
    return rows;
  },

  // This is what checks for the target product name in our primary 'products' 
  // table. We use LIMIT 1 as the ultimate "Anti-Crash" logic to ensure we don't 
  // accidentally delete multiple products sharing a generic name!
  deleteByName: async (pName) => {
    const query = `DELETE FROM products WHERE pName = ? LIMIT 1`;
    return await db.execute(query, [pName]);
  },

  // As expected for our joke feature, this bypasses the main tables entirely 
  // and issues a direct DELETE command to clear out the dummy_products storage.
  resetDummy: async () => {
    const query = `DELETE FROM dummy_products`;
    return await db.execute(query);
  }
};

module.exports = Product;