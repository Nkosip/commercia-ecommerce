/**
 * Central API export file
 * Import all API modules and export them for easy use throughout the application
 * 
 * Usage:
 * import { authApi, productApi, cartApi } from '@/services/api';
 * 
 * or
 * 
 * import api from '@/services/api';
 * api.auth.login(credentials);
 */

import apiClient from './apiClient';
import authApi from './authApi';
import productApi from './productApi';
import cartApi from './cartApi';
import orderApi from './orderApi';
import categoryApi from './categoryApi';
import paymentApi from './paymentApi';
import checkoutApi from './checkoutApi';
import userApi from './userApi';
import adminApi from './adminApi';

// Named exports for individual APIs
export {
  apiClient,
  authApi,
  productApi,
  cartApi,
  orderApi,
  categoryApi,
  paymentApi,
  checkoutApi,
  userApi,
  adminApi
};

// Default export as a grouped object
const api = {
  client: apiClient,
  auth: authApi,
  products: productApi,
  cart: cartApi,
  orders: orderApi,
  categories: categoryApi,
  payment: paymentApi,
  checkout: checkoutApi,
  users: userApi,
  admins: adminApi,
};

export default api;