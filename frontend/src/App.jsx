import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import AddBookPage from './pages/AddBookPage';

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/add" element={<AddBookPage />} />
        <Route
          path="*"
          element={
            <div className="page">
              <p className="empty">That page does not exist.</p>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}
