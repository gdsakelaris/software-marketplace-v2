import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getDownloadUrl } from '../utils/api';

function Success() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [downloadUrl, setDownloadUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const paymentIntent = searchParams.get('payment_intent');

    if (!paymentIntent) {
      setError('Invalid payment confirmation');
      setLoading(false);
      return;
    }

    fetchDownloadUrl(paymentIntent);
  }, [searchParams]);

  const fetchDownloadUrl = async (paymentIntent) => {
    try {
      setLoading(true);
      const data = await getDownloadUrl(paymentIntent);
      setDownloadUrl(data.downloadUrl);
      setError(null);
    } catch (err) {
      console.error('Error fetching download URL:', err);
      setError('Failed to retrieve download link. Please contact support with your payment confirmation.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Confirming your purchase...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="success-container">
        <div className="success-card error">
          <div className="icon">❌</div>
          <h1>Payment Confirmation Error</h1>
          <p>{error}</p>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Return to Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="success-container">
      <div className="success-card">
        <div className="icon success-icon">✓</div>
        <h1>Payment Successful!</h1>
        <p className="success-message">
          Thank you for your purchase. Your payment has been processed successfully.
        </p>

        <div className="download-section">
          <h2>Download Your Product</h2>
          <p>Your download is ready. Click the button below to download your file.</p>

          <a
            href={downloadUrl}
            className="btn btn-primary btn-large download-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            📥 Download Now
          </a>

          <p className="download-note">
            <strong>Important:</strong> Save this link. It will remain active for 24 hours.
          </p>
        </div>

        <div className="next-steps">
          <h3>What's Next?</h3>
          <ul>
            <li>Check your email for a receipt and download link backup</li>
            <li>If you have any issues, please contact our support team</li>
            <li>Explore our other products for more UFC analytics tools</li>
          </ul>
        </div>

        <button onClick={() => navigate('/')} className="btn btn-secondary">
          Browse More Products
        </button>
      </div>
    </div>
  );
}

export default Success;
