const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'rejesha_db',
  port: process.env.DB_PORT || 3306,
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
});

// Test the connection (Simplified for mysql2/promise)
pool.getConnection()
  .then(connection => {
    console.log("Connected to Aiven Cloud Database successfully!");
    connection.release(); // Always release your pieces back to the board
  })
  .catch(err => {
    console.error("Database connection failed:", err.message);
  });

// Native promised pool export
module.exports = pool;