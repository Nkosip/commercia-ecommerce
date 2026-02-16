package com.ats.ecommerce.service.impl;

import com.ats.ecommerce.dto.payment.StripeCheckoutResponse;
import com.ats.ecommerce.entity.*;
import com.ats.ecommerce.entity.enums.OrderStatus;
import com.ats.ecommerce.repository.CartRepository;
import com.ats.ecommerce.repository.OrderRepository;
import com.ats.ecommerce.service.CheckoutService;
import com.ats.ecommerce.service.StripeService;
import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StripeServiceImpl implements StripeService {

    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final CheckoutService checkoutService;

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    @Value("${stripe.webhook.secret:}")
    private String webhookSecret;

    @Value("${frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Override
    @Transactional
    public StripeCheckoutResponse createCheckoutSession(Long cartId, User user) {
        // Initialize Stripe
        Stripe.apiKey = stripeApiKey;

        try {
            // Get cart WITH items (using custom query to avoid lazy loading issues)
            Cart cart = cartRepository.findByIdWithItems(cartId)
                    .orElseThrow(() -> new RuntimeException("Cart not found"));

            System.out.println("📦 Cart loaded: ID=" + cart.getId());
            System.out.println("   User: " + cart.getUser().getEmail());
            System.out.println("   Items count: " + (cart.getItems() != null ? cart.getItems().size() : 0));

            // Verify cart belongs to user
            if (!cart.getUser().getId().equals(user.getId())) {
                throw new RuntimeException("Unauthorized access to cart");
            }

            // Check if cart has items
            if (cart.getItems() == null || cart.getItems().isEmpty()) {
                throw new RuntimeException("Cart is empty - cannot create checkout session");
            }

            // ⚠️ IMPORTANT: Build Stripe line items BEFORE creating order
            // (because checkout() might clear the cart)
            SessionCreateParams.Builder paramsBuilder = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl(frontendUrl + "/checkout/checkout-success?session_id={CHECKOUT_SESSION_ID}")
                    .setCancelUrl(frontendUrl + "/checkout/cancel-order")
                    .setCustomerEmail(user.getEmail());

            // Add cart items as line items
            int itemCount = 0;
            for (CartItem item : cart.getItems()) {
                Product product = item.getProduct();

                System.out.println("   Processing item: " + (product != null ? product.getName() : "NULL") +
                        " | Qty: " + item.getQuantity());

                // Skip items without product or with zero/negative quantity
                if (product == null || item.getQuantity() <= 0) {
                    System.err.println("⚠️ Skipping invalid cart item: " + item.getId());
                    continue;
                }

                // Convert price to cents (Stripe uses smallest currency unit)
                long priceInCents = product.getPrice()
                        .multiply(BigDecimal.valueOf(100))
                        .longValue();

                // Build product data - only add image if it's a valid HTTPS URL
                SessionCreateParams.LineItem.PriceData.ProductData.Builder productDataBuilder =
                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                .setName(product.getName())
                                .setDescription(product.getDescription());

                // Only add image if it's a valid HTTPS URL
                if (product.getImageUrl() != null &&
                        product.getImageUrl().startsWith("https://")) {
                    productDataBuilder.addImage(product.getImageUrl());
                    System.out.println("      Image: " + product.getImageUrl());
                } else {
                    System.out.println("      Image: SKIPPED (not a valid HTTPS URL)");
                }

                SessionCreateParams.LineItem lineItem = SessionCreateParams.LineItem.builder()
                        .setPriceData(
                                SessionCreateParams.LineItem.PriceData.builder()
                                        .setCurrency("zar")
                                        .setUnitAmount(priceInCents)
                                        .setProductData(productDataBuilder.build())
                                        .build()
                        )
                        .setQuantity((long) item.getQuantity())
                        .build();

                paramsBuilder.addLineItem(lineItem);
                itemCount++;
            }

            // Final check - make sure we added at least one line item
            if (itemCount == 0) {
                throw new RuntimeException("No valid items in cart - cannot create checkout session");
            }

            // NOW create the order (after we've captured the cart items for Stripe)
            com.ats.ecommerce.dto.order.OrderDto orderDto = checkoutService.checkout(cartId, user);

            // Add metadata to track the order
            Map<String, String> metadata = new HashMap<>();
            metadata.put("orderId", String.valueOf(orderDto.getOrderId()));
            metadata.put("userId", String.valueOf(user.getId()));
            metadata.put("cartId", String.valueOf(cartId));
            paramsBuilder.putAllMetadata(metadata);

            // Create the session
            Session session = Session.create(paramsBuilder.build());

            System.out.println("✅ Created Stripe checkout session: " + session.getId());
            System.out.println("   Order ID: " + orderDto.getOrderId());
            System.out.println("   Cart items: " + itemCount);

            // Return response with session URL
            return StripeCheckoutResponse.builder()
                    .sessionId(session.getId())
                    .sessionUrl(session.getUrl())
                    .orderId(orderDto.getOrderId())
                    .status("PENDING")
                    .build();

        } catch (StripeException e) {
            throw new RuntimeException("Failed to create Stripe checkout session: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    public void handleWebhook(String payload, String sigHeader) {
        // Skip webhook handling if no webhook secret is configured
        if (webhookSecret == null || webhookSecret.isEmpty()) {
            System.out.println("⚠️ Webhook secret not configured - skipping webhook verification");
            return;
        }

        Stripe.apiKey = stripeApiKey;

        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
        } catch (SignatureVerificationException e) {
            throw new RuntimeException("Invalid webhook signature");
        }

        // Handle the event
        if ("checkout.session.completed".equals(event.getType())) {
            Session session = (Session) event.getDataObjectDeserializer()
                    .getObject()
                    .orElseThrow(() -> new RuntimeException("Failed to deserialize session"));

            // Get order ID from metadata
            String orderIdStr = session.getMetadata().get("orderId");
            if (orderIdStr != null) {
                Long orderId = Long.parseLong(orderIdStr);

                // Update order status to paid/confirmed
                Order order = orderRepository.findById(orderId)
                        .orElseThrow(() -> new RuntimeException("Order not found"));

                // Update order status
                order.setStatus(OrderStatus.CONFIRMED);
                orderRepository.save(order);

                // Delete the cart (since order is now complete)
                String cartIdStr = session.getMetadata().get("cartId");
                if (cartIdStr != null) {
                    Long cartId = Long.parseLong(cartIdStr);
                    cartRepository.deleteById(cartId);
                }
            }
        }
    }

    @Override
    @Transactional
    public StripeCheckoutResponse verifySession(String sessionId) {
        Stripe.apiKey = stripeApiKey;

        try {
            Session session = Session.retrieve(sessionId);

            String orderIdStr = session.getMetadata().get("orderId");
            Long orderId = orderIdStr != null ? Long.parseLong(orderIdStr) : null;

            String status;
            if ("complete".equals(session.getStatus()) && "paid".equals(session.getPaymentStatus())) {
                status = "SUCCESS";

                // ⭐ DEMO MODE: Update order status on verification
                // This allows the app to work without webhooks
                // In production, webhooks would handle this
                if (orderId != null) {
                    try {
                        Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new RuntimeException("Order not found"));

                        // Only update if not already processed
                        if (order.getStatus() == OrderStatus.PENDING) {
                            order.setStatus(OrderStatus.CONFIRMED);
                            orderRepository.save(order);

                            System.out.println("✅ Order #" + orderId + " marked as CONFIRMED (verified on redirect)");

                            // Delete the cart
                            String cartIdStr = session.getMetadata().get("cartId");
                            if (cartIdStr != null) {
                                Long cartId = Long.parseLong(cartIdStr);
                                try {
                                    cartRepository.deleteById(cartId);
                                    System.out.println("✅ Cart #" + cartId + " deleted");
                                } catch (Exception e) {
                                    System.err.println("⚠️ Failed to delete cart: " + e.getMessage());
                                }
                            }
                        }
                    } catch (Exception e) {
                        System.err.println("⚠️ Failed to update order: " + e.getMessage());
                        // Don't fail the verification if order update fails
                    }
                }
            } else if ("expired".equals(session.getStatus())) {
                status = "EXPIRED";
            } else {
                status = "PENDING";
            }

            return StripeCheckoutResponse.builder()
                    .sessionId(session.getId())
                    .sessionUrl(session.getUrl())
                    .orderId(orderId)
                    .status(status)
                    .paymentStatus(session.getPaymentStatus())
                    .build();

        } catch (StripeException e) {
            throw new RuntimeException("Failed to verify session: " + e.getMessage(), e);
        }
    }
}
