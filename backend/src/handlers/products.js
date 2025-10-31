const { dynamodb } = require('../config/aws');
const {
  successResponse,
  notFoundResponse,
  serverErrorResponse,
} = require('../utils/response');

const PRODUCTS_TABLE = process.env.DYNAMODB_PRODUCTS_TABLE || 'products';

/**
 * Get all products
 */
const getAllProducts = async (req, res) => {
  try {
    const params = {
      TableName: PRODUCTS_TABLE,
    };

    const result = await dynamodb.scan(params).promise();

    return res.json({
      success: true,
      products: result.Items || [],
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
    });
  }
};

/**
 * Get product by ID
 */
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const params = {
      TableName: PRODUCTS_TABLE,
      Key: {
        id,
      },
    };

    const result = await dynamodb.get(params).promise();

    if (!result.Item) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    return res.json({
      success: true,
      product: result.Item,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch product',
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
};