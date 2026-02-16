import apiClient from './apiClient';

/**
 * Stripe API Service
 * Handles Stripe Checkout integration
 */

/**
 * Create a Stripe Checkout Session
 * POST /api/stripe/create-checkout-session
 * @param {number} cartId - The cart ID
 * @returns {Promise<Object>} Response with sessionId and sessionUrl
 */
export const createCheckoutSession = async (cartId) => {
  try {
    const response = await apiClient.post('/api/stripe/create-checkout-session', {
      cartId
    });
    return response.data;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

/**
 * Verify a Stripe Checkout Session
 * GET /api/stripe/verify-session/{sessionId}
 * @param {string} sessionId - The Stripe session ID
 * @returns {Promise<Object>} Session verification details
 */
export const verifyStripeSession = async (sessionId) => {
  try {
    const response = await apiClient.get(`/api/stripe/verify-session/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('Error verifying session:', error);
    throw error;
  }
};

export default {
  createCheckoutSession,
  verifyStripeSession,
};