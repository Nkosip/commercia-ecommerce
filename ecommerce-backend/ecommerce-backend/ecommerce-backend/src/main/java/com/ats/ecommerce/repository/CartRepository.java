package com.ats.ecommerce.repository;

import java.util.Optional;

import com.ats.ecommerce.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ats.ecommerce.entity.Cart;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

    Optional<Cart> findByUser(User user);
    Optional<Cart> findByUserId(Long userId);
    
    // 🆕 NEW METHOD - Fetches cart with items and products (prevents lazy loading issues)
    @Query("SELECT c FROM Cart c " +
           "LEFT JOIN FETCH c.items i " +
           "LEFT JOIN FETCH i.product " +
           "WHERE c.id = :cartId")
    Optional<Cart> findByIdWithItems(@Param("cartId") Long cartId);
}