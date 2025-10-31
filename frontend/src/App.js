import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="navbar-container">
            <a href="/" className="navbar-brand">
              Software Sack
            </a>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/checkout/:id" element={<Checkout />} />
            <Route path="/success" element={<Success />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>&copy; 2025 Software Sack. All rights reserved.</p>
          <p>Secure payments powered by Stripe</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
