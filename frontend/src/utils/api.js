import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const getProducts = async () => {
  const response = await axios.get(`${API_URL}/products`);
  return response.data;
};

export const getProduct = async (id) => {
  const response = await axios.get(`${API_URL}/products/${id}`);
  return response.data;
};

export const createPaymentIntent = async (productId) => {
  const response = await axios.post(`${API_URL}/create-payment-intent`, {
    productId,
  });
  return response.data;
};

export const getDownloadUrl = async (orderId) => {
  const response = await axios.get(`${API_URL}/download/${orderId}`);
  return response.data;
};
