package com.ats.ecommerce.dto.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StripeCheckoutResponse {
    private String sessionId;
    private String sessionUrl;
    private Long orderId;
    private String status;
    private String paymentStatus;
}