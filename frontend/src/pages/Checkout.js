import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/CheckoutForm';
import { getProduct, createPaymentIntent } from '../utils/api';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    initializeCheckout();
  }, [id]);

  const initializeCheckout = async () => {
    try {
      setLoading(true);

      // Load product details
      const productData = await getProduct(id);
      setProduct(productData);

      // Create payment intent
      const { clientSecret } = await createPaymentIntent(id);
      setClientSecret(clientSecret);

      setError(null);
    } catch (err) {
      console.error('Error initializing checkout:', err);
      setError('Failed to initialize checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Preparing checkout...</p>
      </div>
    );
  }

  if (error || !product || !clientSecret) {
    return (
      <div className="error">
        <h2>Checkout Error</h2>
        <p>{error || 'Unable to initialize checkout'}</p>
        <button onClick={() => navigate(`/product/${id}`)}>Back to Product</button>
      </div>
    );
  }

  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#0066cc',
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="checkout-container">
      <button onClick={() => navigate(`/product/${id}`)} className="back-button">
        ← Back to Product
      </button>

      <div className="checkout-content">
        <div className="checkout-summary">
          <h2>Order Summary</h2>
          <div className="summary-item">
            <img src={product.imageUrl} alt={product.name} className="summary-image" />
            <div>
              <h3>{product.name}</h3>
              <p className="summary-price">${(product.price / 100).toFixed(2)}</p>
            </div>
          </div>
          <div className="summary-total">
            <span>Total:</span>
            <span className="total-amount">${(product.price / 100).toFixed(2)}</span>
          </div>
        </div>

        <div className="checkout-form-container">
          <h2>Payment Details</h2>
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm productId={id} />
          </Elements>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
