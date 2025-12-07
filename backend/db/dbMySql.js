// backend/db/dbMySQL.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

async function testConnection() {
  try {
    const [rows] = await pool.query('SELECT NOW() AS now');
    console.log('Conectado a MySQL RDS. NOW():', rows[0].now);
  } catch (error) {
    console.error('Error MySQL:', error.message);
  }
}

module.exports = { pool, testConnection };
