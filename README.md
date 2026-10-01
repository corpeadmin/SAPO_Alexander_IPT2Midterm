# Library of Eldoria - Medieval Fantasy Book Catalog

A full-stack web application for managing a library book catalog with a medieval fantasy theme. Built with React, Node.js/Express, and MySQL.

## Purpose

The Library of Eldoria is a digital archive system designed for fantasy-themed libraries, allowing librarians and scholars to catalog, search, and manage their collection of tomes, grimoires, and ancient texts. The application provides a complete CRUD (Create, Read, Update, Delete) interface for book management with an immersive medieval fantasy aesthetic.

## Features

### Core Features
- **Full CRUD Operations**: Create, read, update, and delete book records
- **Advanced Search**: Real-time search across title, author, category, and shelf number
- **Subject Filter**: Narrow the catalogue to a single subject
- **Author Filter**: Narrow the catalogue to a single author
- **Stock Filter**: Show only in-stock, low-stock, or out-of-stock titles
- **Combined Filtering**: Text search, subject, author and stock filters all apply together — every active filter must match
- **Book Management**: Complete book details including title, author, category, copies available, and shelf location
- **Inventory Tracking**: Visual indicators for stock levels (Available, Low Stock, Out of Stock)
- **Recent Activity Feed**: Track recently modified books
- **Statistics Dashboard**: Overview of total books, copies, categories, and stock status

### User Interface
- **Medieval Fantasy Theme**: Parchment backgrounds, gold accents, custom typography (Cinzel, IM Fell English SC, MedievalSharp)
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Immersive Experience**: Themed buttons, cards, tables, modals, and form elements
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation support

### Technical Features
- **RESTful API**: Clean Express.js endpoints for all operations
- **MySQL Database**: Persistent storage with proper indexing
- **Real-time Search**: Debounced search with instant results
- **Modal Dialogs**: View, add, and edit books without page navigation
- **Error Handling**: Graceful error states with user-friendly messages

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **date-fns** - Date formatting
- **CSS3** - Custom medieval fantasy styling (no frameworks)

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL2** - Database driver with connection pooling
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment configuration

### Database
- **MySQL 8.4** - Relational database (Windows service `MySQL84`, TCP port **3301**)

## Project Structure

```
SAPO_Alexander_IPT2Midterm/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js      # Database configuration
│   │   │   ├── pool.js          # MySQL connection pool
│   │   │   └── initDb.js        # Database initialization & seeding
│   │   ├── controllers/
│   │   │   └── bookController.js # Request handlers
│   │   ├── models/
│   │   │   └── Book.js          # Book data model
│   │   ├── routes/
│   │   │   └── books.js         # API routes
│   │   └── index.js             # Entry point
│   ├── .env                     # Environment variables (git-ignored)
│   ├── .env.example             # Template for .env
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── SelectFilter.jsx   # Shared dropdown filter
│   │   │   ├── BookTable.jsx
│   │   │   ├── BookModal.jsx
│   │   │   ├── BookForm.jsx     # Shared add/edit form
│   │   │   ├── StatsCards.jsx
│   │   │   └── ActivityFeed.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   └── AddBookPage.jsx
│   │   ├── services/
│   │   │   └── api.js           # Axios instance & API calls
│   │   ├── lib/
│   │   │   └── stock.js         # Shared stock thresholds
│   │   ├── styles/
│   │   │   ├── index.css        # Imports the three layers below
│   │   │   ├── tokens.css       # Colour, type and spacing scales
│   │   │   ├── base.css         # Reset and element defaults
│   │   │   └── components.css   # Component styles
│   │   ├── App.jsx              # Main app with routing
│   │   └── main.jsx             # Entry point
│   ├── .env                     # Frontend environment variables
│   ├── vite.config.js           # Vite configuration
│   └── package.json
│
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books` | Get all books |
| GET | `/api/books/recent` | Get recent activity (5 latest) |
| GET | `/api/books/search?q={query}` | Search books |
| GET | `/api/books/:id` | Get single book |
| POST | `/api/books` | Create new book |
| PUT | `/api/books/:id` | Update book |
| DELETE | `/api/books/:id` | Delete book |
| GET | `/api/health` | Health check |

### Book Object Schema
```json
{
  "id": 1,
  "title": "The Chronicles of Eldoria",
  "author": "Merlin the Wise",
  "category": "Fantasy",
  "copies_available": 3,
  "shelf_number": "A-001",
  "created_at": "2026-01-15T10:30:00.000Z",
  "updated_at": "2026-01-15T10:30:00.000Z"
}
```

## Pages

1. **Landing Page (`/`)**: Main archive view with search, statistics, book table, and recent activity
2. **Add Tome Page (`/add`)**: Form to add new books to the catalog
3. **View/Edit Modal**: Accessible from the book table for viewing details or editing existing books

## Prerequisites

- Node.js 18+ and npm
- MySQL 8.4 running locally (the `MySQL84` Windows service, listening on port 3301)
- Git (optional)

### Starting the database

The `MySQL84` service is set to start automatically, but if it is stopped you can
start it from an **elevated** command prompt:

```bash
net start MySQL84
```

To confirm which port it is actually using:

```bash
sc qc MySQL84
:: "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqld.exe" --defaults-file="C:\ProgramData\MySQL\MySQL Server 8.4\my.ini" MySQL84
```

The port is defined by `port=3301` in
`C:\ProgramData\MySQL\MySQL Server 8.4\my.ini`. It is **not** the default 3306,
which is why `DB_PORT` must be set in `backend/.env`.


## Installation & Setup

### 1. Clone and Navigate
```bash
cd SAPO_Alexander_IPT2Midterm
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Configure the database connection.
# Copy .env.example to .env and fill in your MySQL credentials:
#   copy .env.example .env
# The defaults assume the MySQL84 service on port 3301.
# DB_HOST=127.0.0.1
# DB_USER=your_mysql_user
# DB_PASSWORD=your_mysql_password
# DB_NAME=library_catalog
# DB_PORT=3301
# PORT=3001

# Initialize database and seed sample data (safe to re-run)
npm run init-db

# Start backend server
npm run dev
```
Backend runs on `http://localhost:3001`

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
Frontend runs on `http://localhost:5173`

### 4. Access the Application
Open `http://localhost:5173` in your browser.

## Environment Variables

### Backend (.env)

Copy `.env.example` to `.env`. This file holds real credentials, so it is
git-ignored.

```env
DB_HOST=127.0.0.1
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=library_catalog
DB_PORT=3301
PORT=3001
```

> `DB_PORT=3301` matches the `MySQL84` service. If you point this at a different
> MySQL instance, change it to whatever `port=` that instance uses.

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
```

## Database Schema

```sql
CREATE TABLE books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  copies_available INT NOT NULL DEFAULT 1,
  shelf_number VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Sample Data

The application seeds 10 fantasy-themed books on first run:
- The Chronicles of Eldoria (Fantasy)
- Dragons of the North (Fantasy)
- The Lost Kingdom (History)
- Potions & Elixirs (Magic)
- Sword & Shield Tactics (Warfare)
- Ancient Runes Decoded (Magic)
- The Elven Archives (History)
- Beastiary of the Realm (Nature)
- Celestial Navigation (Science)
- Forbidden Grimoires (Dark Magic)

## Usage Guide

### Searching Books
1. Use the search bar on the landing page
2. Type any keyword (title, author, category, shelf)
3. Results filter in real-time

### Filtering the Catalogue

Both dropdowns sit beside the search bar, and all filters apply together —
a book must satisfy every active filter to appear.

| Filter | Options |
|--------|---------|
| Search | Any text in title, author, subject or shelf |
| Subject | Every subject present in the catalogue, or "All subjects" |
| Author | Every author present in the catalogue, or "All authors" |
| Stock | In stock, Low stock, Out of stock, or "Any stock level" |

Subject and author options are derived from the catalogue itself, so the
dropdowns can never offer a filter that returns nothing. Matching is
case-sensitive and uses the exact stored spelling.

Stock levels come from a single shared rule in `src/lib/stock.js`, so the table,
the totals strip and the filter can never disagree:

| Copies available | Level |
|------------------|-------|
| 0 | Out of stock |
| 1–2 | Low stock |
| 3+ | In stock |

### Adding a Book
1. Click "✨ Add New Tome" button or navigate to `/add`
2. Fill in all required fields
3. Click "✨ Add to Archives"

### Editing a Book
1. Click "✏️ Edit" on any book row
2. Modify the fields in the modal
3. Click "📝 Update Tome"

### Viewing Details
1. Click "👁 View" on any book row
2. See complete book information
3. Click "Close" to return

### Deleting a Book
1. Click "🗑 Delete" on any book row
2. Confirm the deletion
3. Book is permanently removed

## Development

### Running Both Servers
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### Building for Production
```bash
# Backend
cd backend && npm start

# Frontend
cd frontend && npm run build
# Output in frontend/dist/
```

## Design Decisions

### Medieval Fantasy Theme
- **Fonts**: Cinzel (headings), IM Fell English SC (titles), MedievalSharp (brand)
- **Colors**: Parchment (#f4f0e6), Gold (#c9a84c), Blood (#8b1a1a), Forest (#2d4a2d), Ink (#2c1810)
- **Elements**: Textured backgrounds, ornamental borders, themed icons

### Architecture
- **Separation of Concerns**: Models, controllers, routes separated
- **Connection Pooling**: Efficient database connections
- **Debounced Search**: Reduces API calls
- **Modal Pattern**: Keeps users on main page for view/edit

## License

MIT License - Feel free to use for learning and projects.

---

*May your archives ever grow, and your tomes never gather dust.* 📜✨