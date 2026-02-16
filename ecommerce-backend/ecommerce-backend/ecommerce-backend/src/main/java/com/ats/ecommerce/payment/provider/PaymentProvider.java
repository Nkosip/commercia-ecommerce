package com.ats.ecommerce.payment.provider;

import java.math.BigDecimal;

public interface PaymentProvider {
    String charge(BigDecimal amount);
}
