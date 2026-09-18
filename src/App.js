import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CustomNavbar from './components/Navbar';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import PortfolioPage from './pages/PortfolioPage';
import ContactPage from './pages/ContactPage';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <CustomNavbar />
        <main className="site-main" id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
        </main>
        <footer className="site-footer">© {new Date().getFullYear()} <Link to="/">CFAT</Link> <span aria-hidden="true">|</span> Made with <span aria-label="love">♥</span> by <Link to="/about">Shifat Rahman</Link></footer>
      </div>
    </Router>
  );
}

export default App;
