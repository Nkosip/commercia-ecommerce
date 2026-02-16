import apiClient from './apiClient';

/**
 * Checkout API endpoints
 * Base path: /checkout
 */

const checkoutApi = {
  /**
   * Process checkout and create order from cart
   * POST /checkout/{cartId}
   * @param {number} cartId - Cart ID to checkout
   * @returns {Promise<Object>} Created order
   */
  checkout: async (cartId) => {
    const response = await apiClient.post(`/checkout/${cartId}`);
    
    // Clear cart ID from localStorage after successful checkout
    if (response.data) {
      localStorage.removeItem('cartId');
    }
    
    return response.data;
  },

  /**
   * Complete checkout process with full order details
   * This is a helper function that combines cart checkout with any additional steps
   * @param {number} cartId - Cart ID
   * @param {Object} additionalInfo - Any additional checkout information
   * @returns {Promise<Object>} Created order
   */
  completeCheckout: async (cartId, additionalInfo = {}) => {
    // First, checkout the cart to create the order
    const order = await checkoutApi.checkout(cartId);
    
    // Return the order (payment would be handled separately via paymentApi)
    return order;
  },
};

export default checkoutApi;
