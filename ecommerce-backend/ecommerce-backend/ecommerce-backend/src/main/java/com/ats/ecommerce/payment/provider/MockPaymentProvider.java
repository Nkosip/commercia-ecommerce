package com.ats.ecommerce.payment.provider;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class MockPaymentProvider implements PaymentProvider {

    @Override
    public String charge(BigDecimal amount) {
        // simulate success
        return "MOCK_TXN_" + System.currentTimeMillis();
    }
}
