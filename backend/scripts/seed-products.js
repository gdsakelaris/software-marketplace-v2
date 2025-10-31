require('dotenv').config();
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

AWS.config.update({
  region: process.env.AWS_REGION || 'us-east-1',
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const PRODUCTS_TABLE = process.env.DYNAMODB_PRODUCTS_TABLE || 'products';

/**
 * UFC Analytics Products
 * Sorted by file type (.csv, .exe)
 */
const products = [
  {
    id: uuidv4(),
    name: 'fight_data.csv',
    description: 'Comprehensive database of UFC fight data in CSV format. Contains thousands of historical fights, fighter statistics, outcomes, and detailed metrics. Perfect for data analysis, research, and building your own prediction models.',
    price: 100, // $1.00 in cents
    features: [
      '6000+ historical UFC fights',
      'Fighter statistics and attributes',
      'Fight outcomes and methods',
      'Striking and grappling statistics',
      'Event dates and locations',
      'Ready for data analysis and ML',
    ],
    s3Key: 'products/fight_data.csv',
    category: 'UFC Analytics Data',
    version: '1.0.0',
    fileSize: '3.8 MB',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: uuidv4(),
    name: 'UFC Data Scraper.exe',
    description: 'Powerful desktop application to automatically scrape and collect UFC fight data, fighter statistics, and historical records. Extract comprehensive data from multiple sources and export to CSV for analysis.',
    price: 100, // $1.00 in cents
    features: [
      'Automated data extraction from UFC sources',
      'Fighter statistics and profiles',
      'Historical fight records',
      'Easy-to-use Windows interface',
    ],
    s3Key: 'products/UFC Data Scraper.exe',
    category: 'UFC Analytics Tools',
    version: '1.0.0',
    fileSize: '70.7 MB',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: uuidv4(),
    name: 'UFC Fight Predictor.exe',
    description: 'Advanced machine learning-powered prediction tool for UFC fights. Analyzes fighter statistics, historical performance, and fight dynamics to generate accurate fight outcome predictions.',
    price: 100, // $1.00 in cents
    features: [
      'ML-based fight outcome predictions',
      'Fighter matchup analysis',
      'Statistical probability calculations',
      'Finish method predictions (KO, SUB, DEC)',
      'Export predictions to reports',
    ],
    s3Key: 'products/UFC Fight Predictor.exe',
    category: 'UFC Analytics Tools',
    version: '1.0.0',
    fileSize: '179.5 MB',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

/**
 * Seed products into DynamoDB
 */
async function seedProducts() {
  console.log('Seeding products into DynamoDB...\n');

  try {
    for (const product of products) {
      const params = {
        TableName: PRODUCTS_TABLE,
        Item: product,
      };

      await dynamodb.put(params).promise();
      console.log(`✓ Added product: ${product.name} ($${(product.price / 100).toFixed(2)})`);
      console.log(`  ID: ${product.id}`);
      console.log(`  S3 Key: ${product.s3Key}`);
      console.log('');
    }

    console.log('✓ Successfully seeded all products!');
    console.log(`\nTotal products: ${products.length}`);
    console.log('\nProduct IDs for reference:');
    products.forEach((p) => {
      console.log(`  ${p.name}: ${p.id}`);
    });

    console.log('\n⚠ IMPORTANT NEXT STEPS:');
    console.log('1. Upload the following files to your S3 bucket:');
    products.forEach((p) => {
      console.log(`   - ${p.s3Key}`);
    });
    console.log('\n2. Update the S3_BUCKET_NAME in your .env file');
    console.log('3. Make sure your AWS credentials have S3 and DynamoDB access');
    console.log('4. Start your server: npm start');
  } catch (error) {
    console.error('✗ Error seeding products:', error.message);
    process.exit(1);
  }
}

// Run seeding
seedProducts();
