require('dotenv').config();
const AWS = require('aws-sdk');

AWS.config.update({
  region: process.env.AWS_REGION || 'us-east-1',
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const PRODUCTS_TABLE = process.env.DYNAMODB_PRODUCTS_TABLE || 'products';

/**
 * Clear all products from DynamoDB
 */
async function clearProducts() {
  console.log('Clearing all products from DynamoDB...\n');

  try {
    // Scan to get all products
    const scanParams = {
      TableName: PRODUCTS_TABLE,
    };

    const result = await dynamodb.scan(scanParams).promise();
    const products = result.Items || [];

    console.log(`Found ${products.length} products to delete`);

    // Delete each product
    for (const product of products) {
      const deleteParams = {
        TableName: PRODUCTS_TABLE,
        Key: {
          id: product.id,
        },
      };

      await dynamodb.delete(deleteParams).promise();
      console.log(`✓ Deleted: ${product.name} (${product.id})`);
    }

    console.log(`\n✓ Successfully cleared ${products.length} products!`);
    console.log('\nRun "node scripts/seed-products.js" to add fresh products.');
  } catch (error) {
    console.error('✗ Error clearing products:', error.message);
    process.exit(1);
  }
}

// Run clearing
clearProducts();
