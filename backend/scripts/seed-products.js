require('dotenv').config();
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

AWS.config.update({
  region: process.env.AWS_REGION || 'us-east-1',
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const PRODUCTS_TABLE = process.env.DYNAMODB_PRODUCTS_TABLE || 'products';

/**
 * Sample products to seed
 */
const products = [
  {
    id: uuidv4(),
    name: 'Code2Text Pro',
    description: 'A powerful utility that converts your entire codebase into a single text file for easy sharing, documentation, and AI analysis. Perfect for developers who need to share code context with AI assistants or create comprehensive documentation.',
    price: 2999, // $29.99 in cents
    imageUrl: 'https://via.placeholder.com/400x300/6366f1/ffffff?text=Code2Text+Pro',
    features: [
      'Convert entire projects to single text file',
      'Support for 50+ programming languages',
      'Preserve directory structure in output',
      'Filter files by extension or pattern',
      'Include/exclude folders easily',
      'Generate table of contents',
      'Command-line and GUI interface',
      'Windows, Mac, and Linux support',
    ],
    s3Key: 'products/code2text-pro.zip', // File path in S3
    category: 'Developer Tools',
    version: '2.0.0',
    fileSize: '15 MB',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: uuidv4(),
    name: 'TaskFlow Organizer',
    description: 'An intelligent task management system designed for busy professionals. Combines todo lists, time tracking, and productivity analytics in one beautiful desktop application.',
    price: 4999, // $49.99 in cents
    imageUrl: 'https://via.placeholder.com/400x300/ec4899/ffffff?text=TaskFlow+Organizer',
    features: [
      'Smart task prioritization with AI',
      'Built-in Pomodoro timer',
      'Time tracking and analytics',
      'Calendar integration (Google, Outlook)',
      'Project templates and workflows',
      'Dark mode and customizable themes',
      'Offline mode with cloud sync',
      'Export reports to PDF/Excel',
      'Keyboard shortcuts for power users',
    ],
    s3Key: 'products/taskflow-organizer.zip',
    category: 'Productivity',
    version: '1.5.2',
    fileSize: '85 MB',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: uuidv4(),
    name: 'DataBackup Shield',
    description: 'Enterprise-grade backup solution for small businesses and home users. Automatically backs up your critical files to local drives, network storage, and cloud services with military-grade encryption.',
    price: 7999, // $79.99 in cents
    imageUrl: 'https://via.placeholder.com/400x300/10b981/ffffff?text=DataBackup+Shield',
    features: [
      'Automatic scheduled backups',
      'Multiple backup destinations',
      'AES-256 encryption',
      'Incremental and differential backups',
      'File versioning (keep 30 versions)',
      'One-click file restoration',
      'Email notifications on backup status',
      'Network drive support',
      'Cloud integration (AWS S3, Google Drive, Dropbox)',
      'Bandwidth throttling for background operation',
    ],
    s3Key: 'products/databackup-shield.zip',
    category: 'Security & Backup',
    version: '3.1.0',
    fileSize: '120 MB',
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
