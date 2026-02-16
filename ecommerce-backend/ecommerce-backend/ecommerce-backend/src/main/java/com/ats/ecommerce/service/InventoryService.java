package com.ats.ecommerce.service;

import com.ats.ecommerce.dto.inventory.InventoryResponseDto;

public interface InventoryService {
    InventoryResponseDto getStock(Long productId);
    InventoryResponseDto updateStock(Long productId, int quantity);
}
