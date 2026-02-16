import apiClient from './apiClient';

/**
 * Order API endpoints
 * Base path: /orders
 */

const orderApi = {
  /**
   * Get order by ID
   * GET /orders/{id}
   * @param {number} id - Order ID
   * @returns {Promise<Object>} Order details
   */
  getOrder: async (id) => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },

  /**
   * Get all orders for the current user
   * GET /orders
   * @returns {Promise<Array>} List of user's orders
   */
  getMyOrders: async () => {
    const response = await apiClient.get('/orders');
    return response.data;
  },

  /**
   * Cancel an order
   * DELETE /orders/{id}
   * @param {number} id - Order ID
   * @returns {Promise<void>}
   */
  cancelOrder: async (id) => {
    await apiClient.delete(`/orders/${id}`);
  },

  /**
   * Get order history with optional filtering
   * @param {Object} filters - Optional filters (status, date range, etc.)
   * @returns {Promise<Array>} Filtered list of orders
   */
  getOrderHistory: async (filters = {}) => {
    const orders = await orderApi.getMyOrders();
    
    // Apply client-side filtering if needed
    let filteredOrders = orders;
    
    if (filters.status) {
      filteredOrders = filteredOrders.filter(order => order.status === filters.status);
    }
    
    if (filters.startDate) {
      filteredOrders = filteredOrders.filter(
        order => new Date(order.createdAt) >= new Date(filters.startDate)
      );
    }
    
    if (filters.endDate) {
      filteredOrders = filteredOrders.filter(
        order => new Date(order.createdAt) <= new Date(filters.endDate)
      );
    }
    
    return filteredOrders;
  },

  /**
   * Get order statistics for the current user
   * @returns {Promise<Object>} Order statistics
   */
  getOrderStats: async () => {
    const orders = await orderApi.getMyOrders();
    
    return {
      totalOrders: orders.length,
      pendingOrders: orders.filter(o => o.status === 'PENDING').length,
      completedOrders: orders.filter(o => o.status === 'DELIVERED').length,
      cancelledOrders: orders.filter(o => o.status === 'CANCELLED').length,
      totalSpent: orders.reduce((sum, order) => sum + (order.total || 0), 0),
    };
  },
};

export default orderApi;
