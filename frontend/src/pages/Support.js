import React from 'react';
import { useNavigate } from 'react-router-dom';

function Support() {
  const navigate = useNavigate();

  return (
    <div className="support-container">
      <button onClick={() => navigate('/')} className="back-button">
        ← Back to Products
      </button>

      <div className="support-content">
        <h1>Contact Support</h1>
        <div className="support-info">
          <p>If you need assistance, please call our support line:</p>
          <div className="phone-number">
            <a href="tel:+12194777222">(219) 477-7222</a>
          </div>
          <p>Our support team is here to help with any questions or issues you may have with your purchase.</p>
        </div>
      </div>
    </div>
  );
}

export default Support;
