import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CustomNavbar from './components/Navbar';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import PortfolioPage from './pages/PortfolioPage';
import ContactPage from './pages/ContactPage';
import ShortenPage from './pages/ShortenPage';
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
          <Route path="/shorten" element={<ShortenPage />} />
        </Routes>
        </main>
        <footer className="site-footer">© {new Date().getFullYear()} <Link to="/about">Dewan Sifat Rahman</Link>. All rights reserved.</footer>
      </div>
    </Router>
  );
}

export default App;
