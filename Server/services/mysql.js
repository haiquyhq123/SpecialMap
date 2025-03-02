const mysql = require('mysql2/promise');

// MySQL configuration - update with your actual DB credentials
const dbConfig = {
  host: '10.144.112.60',
  user: 'root',
  password: 'my-secret-pw',
  database: 'Conhacks2025'
};

const pool = mysql.createPool(dbConfig);

module.exports = pool;
