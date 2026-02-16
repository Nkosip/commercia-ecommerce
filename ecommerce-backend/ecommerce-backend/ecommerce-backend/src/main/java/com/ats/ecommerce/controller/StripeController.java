package com.ats.ecommerce.controller;

import com.ats.ecommerce.dto.payment.StripeCheckoutRequest;
import com.ats.ecommerce.dto.payment.StripeCheckoutResponse;
import com.ats.ecommerce.security.UserDetailsImpl;
import com.ats.ecommerce.service.StripeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stripe")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class StripeController {

    private final StripeService stripeService;

    /**
     * Create a Stripe Checkout Session
     * POST /api/stripe/create-checkout-session
     */
    @PostMapping("/create-checkout-session")
    public ResponseEntity<StripeCheckoutResponse> createCheckoutSession(
            @RequestBody StripeCheckoutRequest request,
            @AuthenticationPrincipal UserDetailsImpl user
    ) {
        StripeCheckoutResponse response = stripeService.createCheckoutSession(
                request.getCartId(),
                user.getUser()
        );
        return ResponseEntity.ok(response);
    }

    /**
     * Webhook endpoint for Stripe events
     * POST /api/stripe/webhook
     * This endpoint is called by Stripe when payment events occur
     */
    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader
    ) {
        stripeService.handleWebhook(payload, sigHeader);
        return ResponseEntity.ok("Webhook handled");
    }

    /**
     * Verify payment success (called after user returns from Stripe)
     * GET /api/stripe/verify-session/{sessionId}
     */
    @GetMapping("/verify-session/{sessionId}")
    public ResponseEntity<StripeCheckoutResponse> verifySession(
            @PathVariable String sessionId
    ) {
        StripeCheckoutResponse response = stripeService.verifySession(sessionId);
        return ResponseEntity.ok(response);
    }
}