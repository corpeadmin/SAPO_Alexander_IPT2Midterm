const mysql = require('mysql2/promise');
const dbConfig = require('./database');

const pool = mysql.createPool(dbConfig);

pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
});

module.exports = pool;
