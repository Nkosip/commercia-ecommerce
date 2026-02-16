import apiClient from './apiClient';

/**
 * Payment API endpoints
 * Base path: /payments
 */

const paymentApi = {
  /**
   * Process a payment
   * POST /payments
   * @param {Object} paymentData - Payment details
   * @param {number} paymentData.orderId - Order ID to pay for
   * @param {string} paymentData.paymentMethod - Payment method (e.g., 'CREDIT_CARD', 'PAYPAL')
   * @param {Object} paymentData.paymentDetails - Payment-specific details (card info, etc.)
   * @returns {Promise<Object>} Payment response
   */
  processPayment: async (paymentData) => {
    const response = await apiClient.post('/payments', paymentData);
    return response.data;
  },

  /**
   * Process payment with credit card
   * @param {number} orderId - Order ID
   * @param {Object} cardDetails - { cardNumber, cardHolderName, expiryDate, cvv }
   * @returns {Promise<Object>} Payment response
   */
  payWithCreditCard: async (orderId, cardDetails) => {
    return await paymentApi.processPayment({
      orderId,
      paymentMethod: 'CREDIT_CARD',
      paymentDetails: cardDetails,
    });
  },

  /**
   * Process payment with PayPal
   * @param {number} orderId - Order ID
   * @param {Object} paypalDetails - PayPal-specific details
   * @returns {Promise<Object>} Payment response
   */
  payWithPayPal: async (orderId, paypalDetails) => {
    return await paymentApi.processPayment({
      orderId,
      paymentMethod: 'PAYPAL',
      paymentDetails: paypalDetails,
    });
  },

  /**
   * Process payment with debit card
   * @param {number} orderId - Order ID
   * @param {Object} cardDetails - { cardNumber, cardHolderName, expiryDate, cvv }
   * @returns {Promise<Object>} Payment response
   */
  payWithDebitCard: async (orderId, cardDetails) => {
    return await paymentApi.processPayment({
      orderId,
      paymentMethod: 'DEBIT_CARD',
      paymentDetails: cardDetails,
    });
  },
};

export default paymentApi;
