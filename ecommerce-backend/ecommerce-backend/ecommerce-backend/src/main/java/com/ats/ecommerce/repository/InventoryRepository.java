package com.ats.ecommerce.repository;

import com.ats.ecommerce.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InventoryRepository extends JpaRepository<Inventory,Long> {
    Optional<Inventory> findByProductId(Long productId);
}
