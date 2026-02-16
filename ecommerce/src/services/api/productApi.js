import apiClient from './apiClient';

/**
 * Product API endpoints
 * Base path: /api/v1/products
 */

const productApi = {
  /**
   * Get all products with optional filters
   * GET /api/v1/products?name=&categoryId=&minPrice=&maxPrice=&active=
   * @param {Object} filters - { name, categoryId, minPrice, maxPrice, active }
   * @returns {Promise<Array>} List of products
   */
  getProducts: async (filters = {}) => {
    const params = {};
    
    // Only add defined filter parameters
    if (filters.name) params.name = filters.name;
    if (filters.categoryId) params.categoryId = filters.categoryId;
    if (filters.minPrice !== undefined) params.minPrice = filters.minPrice;
    if (filters.maxPrice !== undefined) params.maxPrice = filters.maxPrice;
    if (filters.active !== undefined) params.active = filters.active;
    
    const response = await apiClient.get('/api/v1/products', { params });
    return response.data;
  },

  /**
   * Get a single product by ID
   * GET /api/v1/products/{id}
   * @param {number} id - Product ID
   * @returns {Promise<Object>} Product details
   */
  getProductById: async (id) => {
    const response = await apiClient.get(`/api/v1/products/${id}`);
    return response.data;
  },

  /**
   * Create a new product (ADMIN only)
   * POST /api/v1/products
   * @param {Object} productData - Product details
   * @returns {Promise<Object>} Created product
   */
  createProduct: async (productData) => {
    const response = await apiClient.post('/api/v1/products', productData);
    return response.data;
  },

  /**
   * Update a product (ADMIN only)
   * PUT /api/v1/products/{id}
   * @param {number} id - Product ID
   * @param {Object} productData - Updated product details
   * @returns {Promise<Object>} Updated product
   */
  updateProduct: async (id, productData) => {
    const response = await apiClient.put(`/api/v1/products/${id}`, productData);
    return response.data;
  },

  /**
   * Update product status (ADMIN only)
   * PUT /api/v1/products/{id}/status
   * @param {number} id - Product ID
   * @param {boolean} enabled - Product enabled status
   * @returns {Promise<Object>} Updated product
   */
  updateProductStatus: async (id, enabled) => {
    const response = await apiClient.put(`/api/v1/products/${id}/status`, { enabled });
    return response.data;
  },

  /**
   * Delete a product (ADMIN only)
   * DELETE /api/v1/products/{id}
   * @param {number} id - Product ID
   * @returns {Promise<void>}
   */
  deleteProduct: async (id) => {
    await apiClient.delete(`/api/v1/products/${id}`);
  },

  /**
   * Search products by name
   * GET /api/v1/products?name={searchTerm}
   * @param {string} searchTerm - Search term
   * @returns {Promise<Array>} List of matching products
   */
  searchProducts: async (searchTerm) => {
    const response = await apiClient.get('/api/v1/products', {
      params: { name: searchTerm }
    });
    return response.data;
  },

  /**
   * Get products by category
   * GET /api/v1/products?categoryId={categoryId}
   * @param {number} categoryId - Category ID
   * @returns {Promise<Array>} List of products in category
   */
  getProductsByCategory: async (categoryId) => {
    const response = await apiClient.get('/api/v1/products', {
      params: { categoryId }
    });
    return response.data;
  },

  /**
   * Get products by price range
   * GET /api/v1/products?minPrice={min}&maxPrice={max}
   * @param {number} minPrice - Minimum price
   * @param {number} maxPrice - Maximum price
   * @returns {Promise<Array>} List of products in price range
   */
  getProductsByPriceRange: async (minPrice, maxPrice) => {
    const response = await apiClient.get('/api/v1/products', {
      params: { minPrice, maxPrice }
    });
    return response.data;
  },
};

export default productApi;
