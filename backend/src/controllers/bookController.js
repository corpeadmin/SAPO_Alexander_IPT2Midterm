const Book = require('../models/Book');

class BookController {
  static async getAllBooks(req, res) {
    try {
      const books = await Book.findAll();
      res.json({ success: true, data: books });
    } catch (error) {
      console.error('Error fetching books:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch books' });
    }
  }

  static async getBookById(req, res) {
    try {
      const { id } = req.params;
      const book = await Book.findById(id);
      if (!book) {
        return res.status(404).json({ success: false, message: 'Book not found' });
      }
      res.json({ success: true, data: book });
    } catch (error) {
      console.error('Error fetching book:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch book' });
    }
  }

  static async searchBooks(req, res) {
    try {
      const { q } = req.query;
      if (!q || q.trim() === '') {
        return res.json({ success: true, data: [] });
      }
      const books = await Book.search(q.trim());
      res.json({ success: true, data: books });
    } catch (error) {
      console.error('Error searching books:', error);
      res.status(500).json({ success: false, message: 'Failed to search books' });
    }
  }

  static async createBook(req, res) {
    try {
      const { title, author, category, copies_available, shelf_number } = req.body;
      
      if (!title || !author || !category || copies_available === undefined || !shelf_number) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
      }

      const book = await Book.create({
        title: title.trim(),
        author: author.trim(),
        category: category.trim(),
        copies_available: parseInt(copies_available),
        shelf_number: shelf_number.trim()
      });
      
      res.status(201).json({ success: true, data: book, message: 'Book added to the archives' });
    } catch (error) {
      console.error('Error creating book:', error);
      res.status(500).json({ success: false, message: 'Failed to create book' });
    }
  }

  static async updateBook(req, res) {
    try {
      const { id } = req.params;
      const { title, author, category, copies_available, shelf_number } = req.body;
      
      if (!title || !author || !category || copies_available === undefined || !shelf_number) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
      }

      const book = await Book.update(id, {
        title: title.trim(),
        author: author.trim(),
        category: category.trim(),
        copies_available: parseInt(copies_available),
        shelf_number: shelf_number.trim()
      });
      
      if (!book) {
        return res.status(404).json({ success: false, message: 'Book not found' });
      }
      
      res.json({ success: true, data: book, message: 'Book record updated' });
    } catch (error) {
      console.error('Error updating book:', error);
      res.status(500).json({ success: false, message: 'Failed to update book' });
    }
  }

  static async deleteBook(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Book.delete(id);
      
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Book not found' });
      }
      
      res.json({ success: true, message: 'Book removed from the archives' });
    } catch (error) {
      console.error('Error deleting book:', error);
      res.status(500).json({ success: false, message: 'Failed to delete book' });
    }
  }

  static async getRecentActivity(req, res) {
    try {
      const books = await Book.getRecentActivity(5);
      res.json({ success: true, data: books });
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch recent activity' });
    }
  }
}

module.exports = BookController;