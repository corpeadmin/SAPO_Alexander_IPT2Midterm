require('dotenv').config();
const dbConfig = require('./database');
const mysql = require('mysql2/promise');

async function initializeDatabase() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
    console.log(`Database '${dbConfig.database}' created or already exists`);

    await connection.query(`USE \`${dbConfig.database}\``);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS books (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        copies_available INT NOT NULL DEFAULT 1,
        shelf_number VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Books table created or already exists');

    const [rows] = await connection.query('SELECT COUNT(*) as count FROM books');
    if (rows[0].count === 0) {
      const seedBooks = [
        ['The Chronicles of Eldoria', 'Merlin the Wise', 'Fantasy', 3, 'A-001'],
        ['Dragons of the North', 'Bard Alaric', 'Fantasy', 2, 'A-002'],
        ['The Lost Kingdom', 'Scribe Elowen', 'History', 1, 'B-001'],
        ['Potions & Elixirs', 'Alchemist Vex', 'Magic', 5, 'C-001'],
        ['Sword & Shield Tactics', 'Knight Commander Garrick', 'Warfare', 2, 'D-001'],
        ['Ancient Runes Decoded', 'Wizard Thaddeus', 'Magic', 1, 'C-002'],
        ['The Elven Archives', 'Lorekeeper Sylvaris', 'History', 4, 'B-002'],
        ['Beastiary of the Realm', 'Hunter Orn', 'Nature', 3, 'E-001'],
        ['Celestial Navigation', 'Astrologer Moonwhisper', 'Science', 2, 'F-001'],
        ['Forbidden Grimoires', 'Warlock Malachar', 'Dark Magic', 1, 'G-001']
      ];

      for (const book of seedBooks) {
        await connection.query(
          'INSERT INTO books (title, author, category, copies_available, shelf_number) VALUES (?, ?, ?, ?, ?)',
          book
        );
      }
      console.log('Sample books seeded successfully');
    } else {
      console.log('Books already exist, skipping seed');
    }

    console.log('Database initialization complete!');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  } finally {
    if (connection) await connection.end();
  }
}

if (require.main === module) {
  initializeDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { initializeDatabase };