package com.ats.ecommerce.service.impl;

import com.ats.ecommerce.dto.inventory.InventoryResponseDto;
import com.ats.ecommerce.entity.Inventory;
import com.ats.ecommerce.repository.InventoryRepository;
import com.ats.ecommerce.repository.ProductRepository;
import com.ats.ecommerce.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class InventoryServiceImpl implements InventoryService {

    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;

    @Override
    public InventoryResponseDto getStock(Long productId) {
        Inventory inventory = inventoryRepository.findByProductId(productId)
                .orElseThrow(() -> new RuntimeException("Inventory not found"));

        return new InventoryResponseDto(productId, inventory.getQuantity());
    }

    @Override
    public InventoryResponseDto updateStock(Long productId, int quantity) {
        Inventory inventory = inventoryRepository.findByProductId(productId)
                .orElseThrow(() -> new RuntimeException("Inventory not found"));

        inventory.setQuantity(quantity);
        inventoryRepository.save(inventory);

        return new InventoryResponseDto(productId, quantity);
    }
}

