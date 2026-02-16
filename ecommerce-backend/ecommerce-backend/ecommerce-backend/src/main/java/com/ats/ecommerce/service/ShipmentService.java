package com.ats.ecommerce.service;

import com.ats.ecommerce.dto.shipping.ShippingRequestDto;
import com.ats.ecommerce.dto.shipping.ShippingResponseDto;

public interface ShipmentService {

    ShippingResponseDto createShipment(ShippingRequestDto request);

    ShippingResponseDto getShipmentById(Long shipmentId);

    ShippingResponseDto getShipmentByOrderId(Long orderId);

    ShippingResponseDto updateShipmentStatus(Long shipmentId, String status);
}

