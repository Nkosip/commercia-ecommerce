package com.ats.ecommerce.mapper;

import com.ats.ecommerce.dto.shipping.ShippingResponseDto;
import com.ats.ecommerce.entity.Shipment;
import org.springframework.stereotype.Component;

@Component
public class ShippingMapper {
    public ShippingResponseDto toDto(Shipment shipment) {
        if (shipment == null) return null;

        return new ShippingResponseDto(
                shipment.getId(),
                shipment.getStatus().name(),
                shipment.getAddress()
        );
    }
}
