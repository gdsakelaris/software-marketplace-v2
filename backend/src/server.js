require('dotenv').config();
const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');

// Import handlers
const { getAllProducts, getProductById } = require('./handlers/products');
const {
  createPaymentIntent,
  confirmPayment,
  handleWebhook,
} = require('./handlers/payments');

// Initialize Express app
const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
};

app.use(cors(corsOptions));

// Body parsing middleware
// Note: Stripe webhook needs raw body, so we handle it separately
app.use(
  express.json({
    verify: (req, res, buf) => {
      if (req.originalUrl.startsWith('/webhook')) {
        req.rawBody = buf.toString();
      }
    },
  })
);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Product routes
app.get('/products', getAllProducts);
app.get('/products/:id', getProductById);

// Payment routes
app.post('/create-payment-intent', createPaymentIntent);
app.post('/confirm-payment', confirmPayment);

// Stripe webhook (uses raw body for signature verification)
app.post('/webhook/stripe', express.raw({ type: 'application/json' }), handleWebhook);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
});

// Export for serverless
module.exports.handler = serverless(app);

// For local development
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports.app = app;