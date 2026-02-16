import apiClient from './apiClient';
import userApi from './userApi';

/**
 * Authentication API endpoints
 * Base path: /auth
 */

const authApi = {
  /**
   * Register a new user
   * POST /auth/register
   * @param {Object} userData - { email, password, firstName, lastName }
   * @returns {Promise<Object>} User data
   */
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  /**
   * Login user
   * POST /auth/login
   * @param {Object} credentials - { email, password }
   * @returns {Promise<Object>} Auth response with token and user
   */
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    
    // Store token in localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      
      // Fetch user data using the token (backend only returns token)
      try {
        const user = await userApi.getCurrentUser();
        localStorage.setItem('user', JSON.stringify(user));
        
        // Return both token and user for consistent frontend handling
        return {
          token: response.data.token,
          user: user
        };
      } catch (error) {
        console.error('Error fetching user data:', error);
        // If fetching user fails, still return token
        return response.data;
      }
    }
    
    return response.data;
  },

  /**
   * Logout user
   * POST /auth/logout
   * @returns {Promise<void>}
   */
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      // Always clear local storage, even if API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('cartId');
    }
  },

  /**
   * Get current user from localStorage
   * @returns {Object|null} User object or null
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Get current token from localStorage
   * @returns {string|null} Token string or null
   */
  getToken: () => {
    return localStorage.getItem('token');
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export default authApi;