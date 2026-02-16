package com.ats.ecommerce.controller;

import com.ats.ecommerce.dto.shipping.ShippingRequestDto;
import com.ats.ecommerce.dto.shipping.ShippingResponseDto;
import com.ats.ecommerce.service.ShipmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/shipments")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ShipmentController {

    private final ShipmentService shipmentService;

    @PostMapping
    public ResponseEntity<ShippingResponseDto> createShipment(
            @Valid @RequestBody ShippingRequestDto request) {

        return ResponseEntity.ok(shipmentService.createShipment(request));
    }

    @GetMapping("/{shipmentId}")
    public ResponseEntity<ShippingResponseDto> getShipment(@PathVariable Long shipmentId) {

        return ResponseEntity.ok(shipmentService.getShipmentById(shipmentId));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<ShippingResponseDto> getShipmentByOrder(@PathVariable Long orderId) {

        return ResponseEntity.ok(shipmentService.getShipmentByOrderId(orderId));
    }

    @PutMapping("/{shipmentId}/status")
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<ShippingResponseDto> updateShipmentStatus(
            @PathVariable Long shipmentId,
            @RequestParam String status) {

        return ResponseEntity.ok(
                shipmentService.updateShipmentStatus(shipmentId, status)
        );
    }
}
