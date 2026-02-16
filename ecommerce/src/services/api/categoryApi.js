import apiClient from './apiClient';

/**
 * Category API endpoints
 * Base path: /api/v1/categories
 */

const categoryApi = {
  /**
   * Get all categories
   * GET /api/v1/categories
   * @returns {Promise<Array>} List of categories
   */
  getAllCategories: async () => {
    const response = await apiClient.get('/api/v1/categories');
    return response.data;
  },

  /**
   * Get category by ID
   * GET /api/v1/categories/{id}
   * @param {number} id - Category ID
   * @returns {Promise<Object>} Category details
   */
  getCategoryById: async (id) => {
    const response = await apiClient.get(`/api/v1/categories/${id}`);
    return response.data;
  },

  /**
   * Create a new category (ADMIN only)
   * POST /api/v1/categories
   * @param {Object} categoryData - { name, description }
   * @returns {Promise<Object>} Created category
   */
  createCategory: async (categoryData) => {
    const response = await apiClient.post('/api/v1/categories', categoryData);
    return response.data;
  },

  /**
   * Update a category (ADMIN only)
   * PUT /api/v1/categories/{id}
   * @param {number} id - Category ID
   * @param {Object} categoryData - { name, description }
   * @returns {Promise<Object>} Updated category
   */
  updateCategory: async (id, categoryData) => {
    const response = await apiClient.put(`/api/v1/categories/${id}`, categoryData);
    return response.data;
  },

  /**
   * Delete a category (ADMIN only)
   * DELETE /api/v1/categories/{id}
   * @param {number} id - Category ID
   * @returns {Promise<void>}
   */
  deleteCategory: async (id) => {
    await apiClient.delete(`/api/v1/categories/${id}`);
  },
};

export default categoryApi;
