package com.ats.ecommerce.dto.payment;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/*
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequestDto {

    @NotNull
    private Long orderId;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal amount;
}
**/

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequestDto {
    private Long orderId;
    private String method; // CARD, EFT, MOCK
}



