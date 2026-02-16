package com.ats.ecommerce.controller;

import com.ats.ecommerce.dto.inventory.InventoryResponseDto;
import com.ats.ecommerce.dto.inventory.InventoryUpdateRequestDto;
import com.ats.ecommerce.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/inventory")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping("/{productId}")
    public InventoryResponseDto getStock(@PathVariable Long productId) {
        return inventoryService.getStock(productId);
    }

    @PutMapping("/{productId}")
    public InventoryResponseDto updateStock(
            @PathVariable Long productId,
            @RequestBody InventoryUpdateRequestDto request
    ) {
        return inventoryService.updateStock(productId, request.getQuantity());
    }
}


