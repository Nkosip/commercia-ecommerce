package com.ats.ecommerce.entity;

import com.ats.ecommerce.entity.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Order order;

    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    private String provider; // STRIPE, PAYPAL, MOCK

    private String reference; // transaction id

    private LocalDateTime createdAt;

    @PrePersist
    void created() {
        this.createdAt = LocalDateTime.now();
        // ✅ REMOVED: this.status = PaymentStatus.INITIATED;
        // The status should be set explicitly by the service layer, not overwritten here!
        // If status is null at persist time, only then set it to INITIATED
        if (this.status == null) {
            this.status = PaymentStatus.INITIATED;
        }
    }
}