package com.ats.ecommerce.dto.shipping;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShippingResponseDto {

    private Long shippingId;
    private String status;
    private String address;
}

