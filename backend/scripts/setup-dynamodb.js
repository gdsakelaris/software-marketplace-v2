require('dotenv').config();
const AWS = require('aws-sdk');

AWS.config.update({
  region: process.env.AWS_REGION || 'us-east-1',
});

const dynamodb = new AWS.DynamoDB();

const PRODUCTS_TABLE = process.env.DYNAMODB_PRODUCTS_TABLE || 'products';
const ORDERS_TABLE = process.env.DYNAMODB_ORDERS_TABLE || 'orders';

/**
 * Create Products table
 */
async function createProductsTable() {
  const params = {
    TableName: PRODUCTS_TABLE,
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' }, // Partition key
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' },
    ],
    BillingMode: 'PAY_PER_REQUEST', // On-demand billing (no provisioned capacity needed)
    Tags: [
      {
        Key: 'Environment',
        Value: process.env.NODE_ENV || 'development',
      },
    ],
  };

  try {
    await dynamodb.createTable(params).promise();
    console.log(`✓ Created table: ${PRODUCTS_TABLE}`);
  } catch (error) {
    if (error.code === 'ResourceInUseException') {
      console.log(`✓ Table already exists: ${PRODUCTS_TABLE}`);
    } else {
      console.error(`✗ Error creating ${PRODUCTS_TABLE}:`, error.message);
      throw error;
    }
  }
}

/**
 * Create Orders table
 */
async function createOrdersTable() {
  const params = {
    TableName: ORDERS_TABLE,
    KeySchema: [
      { AttributeName: 'orderId', KeyType: 'HASH' }, // Partition key
    ],
    AttributeDefinitions: [
      { AttributeName: 'orderId', AttributeType: 'S' },
      { AttributeName: 'paymentIntentId', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'PaymentIntentIndex',
        KeySchema: [
          { AttributeName: 'paymentIntentId', KeyType: 'HASH' },
        ],
        Projection: {
          ProjectionType: 'ALL',
        },
      },
    ],
    BillingMode: 'PAY_PER_REQUEST',
    Tags: [
      {
        Key: 'Environment',
        Value: process.env.NODE_ENV || 'development',
      },
    ],
  };

  try {
    await dynamodb.createTable(params).promise();
    console.log(`✓ Created table: ${ORDERS_TABLE}`);
  } catch (error) {
    if (error.code === 'ResourceInUseException') {
      console.log(`✓ Table already exists: ${ORDERS_TABLE}`);
    } else {
      console.error(`✗ Error creating ${ORDERS_TABLE}:`, error.message);
      throw error;
    }
  }
}

/**
 * Wait for table to become active
 */
async function waitForTable(tableName) {
  console.log(`Waiting for ${tableName} to become active...`);
  await dynamodb.waitFor('tableExists', { TableName: tableName }).promise();
  console.log(`✓ ${tableName} is active`);
}

/**
 * Main setup function
 */
async function setup() {
  console.log('Setting up DynamoDB tables...\n');

  try {
    await createProductsTable();
    await createOrdersTable();

    // Wait for tables to be ready
    await waitForTable(PRODUCTS_TABLE);
    await waitForTable(ORDERS_TABLE);

    console.log('\n✓ DynamoDB setup complete!');
    console.log('\nNext steps:');
    console.log('1. Run "node scripts/seed-products.js" to add sample products');
    console.log('2. Upload your files to S3 bucket');
    console.log('3. Start the server with "npm start"');
  } catch (error) {
    console.error('\n✗ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run setup
setup();
