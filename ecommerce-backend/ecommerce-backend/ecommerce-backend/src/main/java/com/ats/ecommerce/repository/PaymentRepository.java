package com.ats.ecommerce.repository;

import com.ats.ecommerce.entity.Payment;
import com.ats.ecommerce.entity.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    boolean existsByOrderIdAndStatus(Long orderId, PaymentStatus status);
}

