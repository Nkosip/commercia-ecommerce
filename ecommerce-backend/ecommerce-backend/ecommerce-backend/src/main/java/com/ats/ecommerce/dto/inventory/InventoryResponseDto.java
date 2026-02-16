package com.ats.ecommerce.dto.inventory;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
public class InventoryResponseDto {
    private Long productId;
    private Integer quantity;
}
