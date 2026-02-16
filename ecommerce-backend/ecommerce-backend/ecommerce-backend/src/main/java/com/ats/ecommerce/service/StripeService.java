package com.ats.ecommerce.service;

import com.ats.ecommerce.dto.payment.StripeCheckoutResponse;
import com.ats.ecommerce.entity.User;

public interface StripeService {
    
    /**
     * Create a Stripe Checkout Session for a cart
     * @param cartId The cart ID
     * @param user The user making the purchase
     * @return StripeCheckoutResponse with session URL
     */
    StripeCheckoutResponse createCheckoutSession(Long cartId, User user);
    
    /**
     * Handle Stripe webhook events
     * @param payload The webhook payload
     * @param sigHeader The Stripe signature header
     */
    void handleWebhook(String payload, String sigHeader);
    
    /**
     * Verify a Stripe Checkout Session
     * @param sessionId The Stripe session ID
     * @return StripeCheckoutResponse with session details
     */
    StripeCheckoutResponse verifySession(String sessionId);
}