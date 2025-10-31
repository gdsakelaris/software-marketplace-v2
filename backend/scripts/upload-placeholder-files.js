require('dotenv').config();
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

AWS.config.update({
  region: process.env.AWS_REGION || 'us-east-1',
});

const s3 = new AWS.S3();
const S3_BUCKET = process.env.S3_BUCKET_NAME;

if (!S3_BUCKET) {
  console.error('Error: S3_BUCKET_NAME environment variable is not set');
  process.exit(1);
}

/**
 * Create placeholder files and upload to S3
 */
async function uploadPlaceholderFiles() {
  console.log(`Uploading placeholder files to S3 bucket: ${S3_BUCKET}\n`);

  const files = [
    {
      key: 'products/ufc-data-scraper.exe',
      content: 'This is a placeholder file for UFC Data Scraper. Replace with actual .exe file.',
      contentType: 'application/octet-stream'
    },
    {
      key: 'products/ufc-fight-predictor.exe',
      content: 'This is a placeholder file for UFC Fight Predictor. Replace with actual .exe file.',
      contentType: 'application/octet-stream'
    },
    {
      key: 'products/fight_data.csv',
      content: 'fight_id,fighter1,fighter2,winner,method,date\n1,Fighter A,Fighter B,Fighter A,KO,2024-01-01\n',
      contentType: 'text/csv'
    }
  ];

  try {
    for (const file of files) {
      const params = {
        Bucket: S3_BUCKET,
        Key: file.key,
        Body: Buffer.from(file.content),
        ContentType: file.contentType,
      };

      await s3.putObject(params).promise();
      console.log(`✓ Uploaded: ${file.key}`);
    }

    console.log('\n✓ Successfully uploaded all placeholder files!');
    console.log('\n⚠ IMPORTANT:');
    console.log('These are placeholder files. Replace them with actual product files:');
    files.forEach(f => {
      console.log(`  - ${f.key}`);
    });
  } catch (error) {
    console.error('✗ Error uploading files:', error.message);
    console.error('\nMake sure:');
    console.error('1. Your AWS credentials are configured');
    console.error('2. The S3 bucket exists');
    console.error('3. You have PutObject permissions for the bucket');
    process.exit(1);
  }
}

// Run upload
uploadPlaceholderFiles();
