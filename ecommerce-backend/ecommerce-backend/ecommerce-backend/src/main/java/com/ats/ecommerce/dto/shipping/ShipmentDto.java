package com.ats.ecommerce.dto.shipping;

import lombok.Data;
@Data
public class ShipmentDto {
    private Long shipmentId;
    private Long orderId;
    private String status;
}

