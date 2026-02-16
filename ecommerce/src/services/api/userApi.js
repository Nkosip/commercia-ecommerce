import apiClient from './apiClient';

/**
 * User API endpoints
 * Base path: /api/v1/users
 */

const userApi = {
  /**
   * Get current user information
   * GET /api/v1/users/me
   * Requires authentication token
   * @returns {Promise<Object>} User data with roles
   */
  getCurrentUser: async () => {
    const response = await apiClient.get('/api/v1/users/me');
    return response.data;
  },

  /**
   * Update current user profile
   * PUT /api/v1/users/me
   * @param {Object} profileData - { firstName, lastName }
   * @returns {Promise<Object>} Updated user data
   */
  updateProfile: async (profileData) => {
    const response = await apiClient.put('/api/v1/users/me', profileData);
    return response.data;
  },

  /**
   * Update current user password
   * PUT /api/v1/users/me/password
   * @param {Object} passwordData - { currentPassword, newPassword }
   * @returns {Promise<void>}
   */
  updatePassword: async (passwordData) => {
    const response = await apiClient.put('/api/v1/users/me/password', passwordData);
    return response.data;
  },

  // Admin endpoints
  /**
   * Get all users (Admin only)
   * GET /api/v1/users
   * @returns {Promise<Array>} List of all users
   */
  getAllUsers: async () => {
    const response = await apiClient.get('/api/v1/users');
    return response.data;
  },

  /**
   * Get user by ID (Admin only)
   * GET /api/v1/users/:id
   * @param {number} id - User ID
   * @returns {Promise<Object>} User data
   */
  getUserById: async (id) => {
    const response = await apiClient.get(`/api/v1/users/${id}`);
    return response.data;
  },

  /**
   * Update user status (Admin only)
   * PUT /api/v1/users/:id/status
   * @param {number} id - User ID
   * @param {Object} statusData - { enabled, locked }
   * @returns {Promise<Object>} Updated user data
   */
  updateUserStatus: async (id, statusData) => {
    const response = await apiClient.put(`/api/v1/users/${id}/status`, statusData);
    return response.data;
  },

  /**
   * Update user role (Admin only)
   * PUT /api/v1/users/:id/role
   * @param {number} id - User ID
   * @param {Object} roleData - { roleIds }
   * @returns {Promise<Object>} Updated user data
   */
  updateUserRole: async (id, roleData) => {
    const response = await apiClient.put(`/api/v1/users/${id}/role`, roleData);
    return response.data;
  },
};

export default userApi;