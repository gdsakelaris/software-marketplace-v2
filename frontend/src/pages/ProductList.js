import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../utils/api';

function ProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data.products || data);
      setError(null);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (productId) => {
    setExpandedId(expandedId === productId ? null : productId);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={loadProducts}>Retry</button>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <header className="header">
        <h1>Products</h1>
      </header>

      <div className="products-list">
        {products.map((product) => (
          <div key={product.id} className="product-row">
            <div className="product-main" onClick={() => toggleExpand(product.id)}>
              <span className="product-name">{product.name}</span>
              <span className="product-price">${(product.price / 100).toFixed(2)}</span>
              <span className="expand-icon">{expandedId === product.id ? '▼' : '▶'}</span>
            </div>

            {expandedId === product.id && (
              <div className="product-expanded">
                <p className="product-description">{product.description}</p>

                {product.features && product.features.length > 0 && (
                  <div className="product-features">
                    <strong>Features:</strong>
                    <ul>
                      {product.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="product-meta">
                  {product.fileSize && <span>Size: {product.fileSize}</span>}
                </div>

                <button
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="btn btn-primary"
                >
                  Purchase
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="empty-state">
          <p>No products available at the moment.</p>
        </div>
      )}
    </div>
  );
}

export default ProductList;
