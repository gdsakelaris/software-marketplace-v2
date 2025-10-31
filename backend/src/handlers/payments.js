const stripe = require('../config/stripe');
const { dynamodb, s3 } = require('../config/aws');

const PRODUCTS_TABLE = process.env.DYNAMODB_PRODUCTS_TABLE || 'products';
const ORDERS_TABLE = process.env.DYNAMODB_ORDERS_TABLE || 'orders';
const S3_BUCKET = process.env.S3_BUCKET_NAME;

/**
 * Create a Stripe Payment Intent
 */
const createPaymentIntent = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        error: 'Product ID is required',
      });
    }

    // Get product from DynamoDB
    const params = {
      TableName: PRODUCTS_TABLE,
      Key: { id: productId },
    };

    const result = await dynamodb.get(params).promise();

    if (!result.Item) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    const product = result.Item;

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: product.price, // Amount in cents
      currency: 'usd',
      metadata: {
        productId: product.id,
        productName: product.name,
      },
      description: `Purchase of ${product.name}`,
    });

    return res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create payment intent',
    });
  }
};

/**
 * Confirm payment and generate download URL
 */
const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        error: 'Payment Intent ID is required',
      });
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        error: 'Payment not completed',
      });
    }

    const productId = paymentIntent.metadata.productId;

    // Get product details
    const productParams = {
      TableName: PRODUCTS_TABLE,
      Key: { id: productId },
    };

    const productResult = await dynamodb.get(productParams).promise();

    if (!productResult.Item) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    const product = productResult.Item;

    // Save order to DynamoDB
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const orderParams = {
      TableName: ORDERS_TABLE,
      Item: {
        orderId,
        productId,
        productName: product.name,
        paymentIntentId,
        amount: paymentIntent.amount,
        status: 'completed',
        createdAt: Date.now(),
      },
    };

    await dynamodb.put(orderParams).promise();

    // Generate S3 signed URL for download (valid for 1 hour)
    let downloadUrl = null;

    if (product.s3Key) {
      const s3Params = {
        Bucket: S3_BUCKET,
        Key: product.s3Key,
        Expires: 3600, // 1 hour
      };

      downloadUrl = await s3.getSignedUrlPromise('getObject', s3Params);
    }

    return res.json({
      success: true,
      downloadUrl,
      orderId,
      productName: product.name,
    });
  } catch (error) {
    console.error('Error confirming payment:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to confirm payment',
    });
  }
};

/**
 * Stripe webhook handler for async payment events
 */
const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    let event;

    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      event = req.body;
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('PaymentIntent succeeded:', event.data.object.id);
        break;
      case 'payment_intent.payment_failed':
        console.log('PaymentIntent failed:', event.data.object.id);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(400).json({
      success: false,
      error: 'Webhook error',
    });
  }
};

module.exports = {
  createPaymentIntent,
  confirmPayment,
  handleWebhook,
};