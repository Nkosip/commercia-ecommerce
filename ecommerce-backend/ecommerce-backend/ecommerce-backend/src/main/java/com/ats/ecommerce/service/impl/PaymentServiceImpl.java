package com.ats.ecommerce.service.impl;

import com.ats.ecommerce.dto.payment.PaymentRequestDto;
import com.ats.ecommerce.dto.payment.PaymentResponseDto;
import com.ats.ecommerce.entity.Order;
import com.ats.ecommerce.entity.Payment;
import com.ats.ecommerce.entity.enums.OrderStatus;
import com.ats.ecommerce.entity.enums.PaymentStatus;
import com.ats.ecommerce.exception.DuplicateResourceException;
import com.ats.ecommerce.exception.ResourceNotFoundException;
import com.ats.ecommerce.payment.provider.PaymentProvider;
import com.ats.ecommerce.repository.OrderRepository;
import com.ats.ecommerce.repository.PaymentRepository;
import com.ats.ecommerce.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    // Inject BOTH providers
    private final PaymentProvider mockPaymentProvider;

    @Qualifier("stripePaymentProvider")
    private final PaymentProvider stripePaymentProvider;

    @Override
    public PaymentResponseDto pay(PaymentRequestDto request) {

        // 1️⃣ Fetch order
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        // 2️⃣ Prevent duplicate payment
        if (paymentRepository.existsByOrderIdAndStatus(order.getId(), PaymentStatus.SUCCESS)) {
            throw new DuplicateResourceException("Order already paid");
        }

        // 3️⃣ Create payment entity
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(order.getTotalAmount());
        payment.setStatus(PaymentStatus.INITIATED);

        try {
            String reference;

            // 4️⃣ Decide payment provider
            if ("CARD".equalsIgnoreCase(request.getMethod())) {
                payment.setProvider("STRIPE");
                reference = stripePaymentProvider.charge(order.getTotalAmount());
            } else {
                payment.setProvider("MOCK");
                reference = mockPaymentProvider.charge(order.getTotalAmount());
            }

            // 5️⃣ Payment success
            payment.setReference(reference);
            payment.setStatus(PaymentStatus.SUCCESS);

            // 6️⃣ Update order status
            order.setStatus(OrderStatus.CONFIRMED);

        } catch (Exception ex) {
            // 7️⃣ Payment failed
            payment.setStatus(PaymentStatus.FAILED);
        }

        Payment savedPayment = paymentRepository.save(payment);

        return new PaymentResponseDto(
                savedPayment.getId(),
                savedPayment.getStatus().name(),
                savedPayment.getReference()
        );
    }
}
