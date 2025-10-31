import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import Support from './pages/Support';
import Terms from './pages/Terms';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="navbar-container">
            <a href="/" className="navbar-brand">
              <img src="/images/Logo Square.png" alt="Software Sack Logo" className="navbar-logo" />
              <span>Software Sack</span>
            </a>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/checkout/:id" element={<Checkout />} />
            <Route path="/success" element={<Success />} />
            <Route path="/support" element={<Support />} />
            <Route path="/terms" element={<Terms />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>&copy; 2025 Telescode. All rights reserved.</p>
          <p className="footer-links">
            <a href="/terms">Terms of Service</a> | <a href="/support">Support</a>
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
