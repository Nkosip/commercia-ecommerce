package com.ats.ecommerce.controller;

import com.ats.ecommerce.dto.payment.PaymentRequestDto;
import com.ats.ecommerce.dto.payment.PaymentResponseDto;
import com.ats.ecommerce.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/payments")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<PaymentResponseDto> pay(
            @RequestBody @Valid PaymentRequestDto request
    ) {
        return ResponseEntity.ok(paymentService.pay(request));
    }
}
