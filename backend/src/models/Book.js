const pool = require('../config/pool');

class Book {
  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM books ORDER BY created_at DESC');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM books WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async search(query) {
    const searchTerm = `%${query}%`;
    const [rows] = await pool.query(
      `SELECT * FROM books 
       WHERE title LIKE ? OR author LIKE ? OR category LIKE ? OR shelf_number LIKE ?
       ORDER BY created_at DESC`,
      [searchTerm, searchTerm, searchTerm, searchTerm]
    );
    return rows;
  }

  static async create(bookData) {
    const { title, author, category, copies_available, shelf_number } = bookData;
    const [result] = await pool.query(
      'INSERT INTO books (title, author, category, copies_available, shelf_number) VALUES (?, ?, ?, ?, ?)',
      [title, author, category, copies_available, shelf_number]
    );
    return this.findById(result.insertId);
  }

  static async update(id, bookData) {
    const { title, author, category, copies_available, shelf_number } = bookData;
    const [result] = await pool.query(
      'UPDATE books SET title = ?, author = ?, category = ?, copies_available = ?, shelf_number = ? WHERE id = ?',
      [title, author, category, copies_available, shelf_number, id]
    );
    if (result.affectedRows === 0) return null;
    return this.findById(id);
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM books WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async getRecentActivity(limit = 5) {
    const [rows] = await pool.query(
      'SELECT * FROM books ORDER BY updated_at DESC LIMIT ?',
      [limit]
    );
    return rows;
  }
}

module.exports = Book;