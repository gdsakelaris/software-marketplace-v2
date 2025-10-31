import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct } from '../utils/api';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await getProduct(id);
      setProduct(data.product || data);
      setError(null);
    } catch (err) {
      console.error('Error loading product:', err);
      setError('Failed to load product details.');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = () => {
    navigate(`/checkout/${id}`);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="error">
        <h2>Error</h2>
        <p>{error || 'Product not found'}</p>
        <button onClick={() => navigate('/')}>Back to Products</button>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <button onClick={() => navigate('/')} className="back-button">
        ← Back to Products
      </button>

      <div className="product-detail">
        <div className="product-detail-info">
          <h1>{product.name}</h1>
          <p className="product-detail-description">{product.description}</p>

          {product.features && product.features.length > 0 && (
            <div className="features">
              <h3>Features:</h3>
              <ul>
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="product-meta">
            {product.category && (
              <div className="meta-item">
                <strong>Category:</strong> {product.category}
              </div>
            )}
            {product.version && (
              <div className="meta-item">
                <strong>Version:</strong> {product.version}
              </div>
            )}
            {product.fileSize && (
              <div className="meta-item">
                <strong>File Size:</strong> {product.fileSize}
              </div>
            )}
          </div>

          <div className="purchase-section">
            <div className="price-large">${(product.price / 100).toFixed(2)}</div>
            <button onClick={handlePurchase} className="btn btn-primary btn-large">
              Purchase Now
            </button>
            <p className="secure-note">🔒 Secure payment powered by Stripe</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
