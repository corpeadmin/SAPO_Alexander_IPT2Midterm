require('dotenv').config();

const port = parseInt(process.env.DB_PORT, 10);

module.exports = {
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME || 'library_catalog',
  // 3301 is the port configured in
  // C:\ProgramData\MySQL\MySQL Server 8.4\my.ini for the MySQL84 service.
  port: Number.isNaN(port) ? 3301 : port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
};
