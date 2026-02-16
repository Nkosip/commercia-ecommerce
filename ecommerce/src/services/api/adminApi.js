import apiClient from './apiClient';

/**
 * Admin API Service
 * Handles all admin-related API calls
 */

// Get dashboard statistics
export const getDashboardStats = async () => {
  try {
    const response = await apiClient.get('/api/admin/dashboard');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

// Get all orders (admin view)
export const getAllOrders = async () => {
  try {
    const response = await apiClient.get('/api/admin/orders');
    return response.data;
  } catch (error) {
    console.error('Error fetching all orders:', error);
    throw error;
  }
};

// Get all products (admin view)
export const getAllProducts = async () => {
  try {
    const response = await apiClient.get('/api/admin/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching all products:', error);
    throw error;
  }
};

// Create a new product
export const createProduct = async (productData) => {
  try {
    const response = await apiClient.post('/api/v1/products', productData);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Update a product
export const updateProduct = async (productId, productData) => {
  try {
    const response = await apiClient.put(`/api/v1/products/${productId}`, productData);
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Update product status (enable/disable)
export const updateProductStatus = async (productId, enabled) => {
  try {
    const response = await apiClient.put(`/api/v1/products/${productId}/status`, { enabled });
    return response.data;
  } catch (error) {
    console.error('Error updating product status:', error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (productId) => {
  try {
    const response = await apiClient.delete(`/api/v1/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Get a single product by ID
export const getProductById = async (productId) => {
  try {
    const response = await apiClient.get(`/api/v1/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

// Update order status (cancel order)
export const cancelOrder = async (orderId) => {
  try {
    const response = await apiClient.delete(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error canceling order:', error);
    throw error;
  }
};

// Get single order details
export const getOrderById = async (orderId) => {
  try {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

export default {
  getDashboardStats,
  getAllOrders,
  getAllProducts,
  createProduct,
  updateProduct,
  updateProductStatus,
  deleteProduct,
  getProductById,
  cancelOrder,
  getOrderById,
};