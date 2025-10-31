import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

function CheckoutForm({ productId }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
      },
    });

    if (error) {
      if (error.type === 'card_error' || error.type === 'validation_error') {
        setMessage(error.message);
      } else {
        setMessage('An unexpected error occurred.');
      }
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: 'tabs',
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <PaymentElement options={paymentElementOptions} />

      <button
        disabled={isLoading || !stripe || !elements}
        className="btn btn-primary btn-large payment-button"
      >
        <span>
          {isLoading ? (
            <>
              <div className="spinner-small"></div>
              Processing...
            </>
          ) : (
            'Pay Now'
          )}
        </span>
      </button>

      {message && <div className="payment-message">{message}</div>}

      <p className="payment-terms">
        By completing this purchase, you agree to our terms of service.
        All sales are final. You will receive an instant download link upon successful payment.
      </p>
    </form>
  );
}

export default CheckoutForm;
