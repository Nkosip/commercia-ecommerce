package com.ats.ecommerce.payment.provider;

import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component("stripePaymentProvider")
public class StripePaymentProvider implements PaymentProvider {

    @Override
    public String charge(BigDecimal amount) {

        try {
            // Stripe works in the smallest currency unit (cents)
            long amountInCents = amount.multiply(BigDecimal.valueOf(100)).longValue();

            PaymentIntentCreateParams params =
                    PaymentIntentCreateParams.builder()
                            .setAmount(amountInCents)
                            .setCurrency("zar")
                            .setAutomaticPaymentMethods(
                                    PaymentIntentCreateParams
                                            .AutomaticPaymentMethods
                                            .builder()
                                            .setEnabled(true)
                                            .build()
                            )
                            .build();

            PaymentIntent intent = PaymentIntent.create(params);

            return intent.getId(); // Stripe transaction reference

        } catch (Exception e) {
            throw new RuntimeException("Stripe payment failed", e);
        }
    }
}