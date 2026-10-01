import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import CataloguePage from './pages/CataloguePage';
import AddBookPage from './pages/AddBookPage';

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/catalogue" element={<CataloguePage />} />
        <Route path="/add" element={<AddBookPage />} />
        <Route path="/index.html" element={<Navigate to="/" replace />} />
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
