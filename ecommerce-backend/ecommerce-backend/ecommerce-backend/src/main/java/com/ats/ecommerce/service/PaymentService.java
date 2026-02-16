package com.ats.ecommerce.service;

import com.ats.ecommerce.dto.payment.PaymentRequestDto;
import com.ats.ecommerce.dto.payment.PaymentResponseDto;

public interface PaymentService {
    PaymentResponseDto pay(PaymentRequestDto request);
}

