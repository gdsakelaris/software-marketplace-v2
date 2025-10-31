import React from 'react';
import { useNavigate } from 'react-router-dom';

function Terms() {
  const navigate = useNavigate();

  return (
    <div className="terms-container">
      <button onClick={() => navigate('/')} className="back-button">
        ← Back to Products
      </button>

      <div className="terms-content">
        <h1>Terms of Service</h1>

        <section>
          <h2>1. License</h2>
          <p>All products are licensed for personal use only. You may not redistribute, resell, or share purchased software.</p>
        </section>

        <section>
          <h2>2. Payments</h2>
          <p>All prices are in USD. Payments are processed securely through Stripe. All sales are final.</p>
        </section>

        <section>
          <h2>3. Downloads</h2>
          <p>Download links are valid for 1 hour. You are responsible for saving your files immediately after purchase.</p>
        </section>

        <section>
          <h2>4. Refunds</h2>
          <p>Due to the digital nature of our products, all sales are final. Contact support if you experience technical issues.</p>
        </section>

        <section>
          <h2>5. Warranty</h2>
          <p>Software is provided "as-is" without warranties. We are not liable for any damages resulting from use of our products.</p>
        </section>

        <section>
          <h2>6. Contact</h2>
          <p>For questions or support, contact us at <a href="mailto:gdsakelaris@gmail.com">gdsakelaris@gmail.com</a> or call <a href="tel:+12194777222">(219) 477-7222</a>.</p>
        </section>

        <p className="terms-footer">Last updated: October 2025</p>
      </div>
    </div>
  );
}

export default Terms;
