package com.ats.ecommerce.service.impl;

import com.ats.ecommerce.dto.shipping.ShippingRequestDto;
import com.ats.ecommerce.dto.shipping.ShippingResponseDto;
import com.ats.ecommerce.entity.Order;
import com.ats.ecommerce.entity.Shipment;
import com.ats.ecommerce.entity.enums.ShipmentStatus;
import com.ats.ecommerce.exception.ResourceNotFoundException;
import com.ats.ecommerce.mapper.ShippingMapper;
import com.ats.ecommerce.repository.OrderRepository;
import com.ats.ecommerce.repository.ShipmentRepository;
import com.ats.ecommerce.service.ShipmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ShipmentServiceImpl implements ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final OrderRepository orderRepository;
    private final ShippingMapper shippingMapper;

    @Override
    public ShippingResponseDto createShipment(ShippingRequestDto request) {

        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        Shipment shipment = new Shipment();
        shipment.setOrder(order);
        shipment.setAddress(request.getAddress());
        shipment.setStatus(ShipmentStatus.CREATED);

        Shipment savedShipment = shipmentRepository.save(shipment);

        return shippingMapper.toDto(savedShipment);
    }

    @Override
    public ShippingResponseDto getShipmentById(Long shipmentId) {

        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found"));

        return shippingMapper.toDto(shipment);
    }

    @Override
    public ShippingResponseDto getShipmentByOrderId(Long orderId) {

        Shipment shipment = shipmentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found for order"));

        return shippingMapper.toDto(shipment);
    }


    @Override
    public ShippingResponseDto updateShipmentStatus(Long shipmentId, String status) {

        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found"));

        ShipmentStatus newStatus = ShipmentStatus.valueOf(status);
        ShipmentStatus currentStatus = shipment.getStatus();

        if (!isValidTransition(currentStatus, newStatus)) {
            throw new IllegalStateException(
                    "Invalid shipment status transition: "
                            + currentStatus + " → " + newStatus
            );
        }

        shipment.setStatus(newStatus);

        return shippingMapper.toDto(shipmentRepository.save(shipment));
    }

    private boolean isValidTransition(ShipmentStatus current, ShipmentStatus next) {

        return switch (current) {
            case CREATED -> next == ShipmentStatus.SHIPPED;
            case SHIPPED -> next == ShipmentStatus.DELIVERED;
            case DELIVERED -> false;
        };
    }


}

