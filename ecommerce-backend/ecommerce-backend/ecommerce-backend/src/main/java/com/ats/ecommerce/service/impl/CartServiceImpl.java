package com.ats.ecommerce.service.impl;

import com.ats.ecommerce.dto.cart.CartDto;
import com.ats.ecommerce.entity.Cart;
import com.ats.ecommerce.entity.CartItem;
import com.ats.ecommerce.exception.ResourceNotFoundException;
import com.ats.ecommerce.mapper.CartMapper;
import com.ats.ecommerce.repository.CartItemRepository;
import com.ats.ecommerce.repository.CartRepository;
import com.ats.ecommerce.repository.UserRepository;
import com.ats.ecommerce.service.CartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final CartItemRepository cartItemRepository;
    private final CartMapper cartMapper;

    @Override
    public Cart createCart(Long userId) {
        Cart cart = new Cart();
        cart.setCreatedAt(LocalDateTime.now());

        if (userId != null) {
            cart.setUser(
                    userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found"))
            );
        }

        return cartRepository.save(cart);
    }

    @Override
    public Cart getCartEntity(Long cartId) {
        return cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
    }

    @Override
    public CartDto getCart(Long cartId) {
        return cartMapper.toDto(getCartEntity(cartId));
    }

    @Override
    public void clearCart(Long cartId) {
        Cart cart = getCartEntity(cartId);
        
        log.info("Clearing cart ID: {}", cartId);
        log.info("Cart has {} items before clearing", cart.getItems().size());
        
        // Get all cart items
        List<CartItem> items = cart.getItems();
        
        if (items != null && !items.isEmpty()) {
            // Clear the collection
            cart.getItems().clear();
            
            // Explicitly delete all cart items from the database
            cartItemRepository.deleteAll(items);
            
            // Recalculate total (will be zero)
            cart.recalculateTotal();
            
            // Save the cart to ensure changes are persisted
            cartRepository.save(cart);
            
            log.info("Cart cleared successfully. Deleted {} items. Cart entity preserved.", items.size());
        } else {
            log.info("Cart is already empty");
        }
    }

    @Override
    public void deleteCart(Long cartId) {
        Cart cart = getCartEntity(cartId);
        
        log.info("Deleting cart ID: {}", cartId);
        log.info("Cart has {} items before deletion", cart.getItems().size());
        
        // Get all cart items
        List<CartItem> items = cart.getItems();
        
        if (items != null && !items.isEmpty()) {
            // Delete all cart items first
            cartItemRepository.deleteAll(items);
            log.info("Deleted {} cart items", items.size());
        }
        
        // Now delete the cart itself
        cartRepository.delete(cart);
        
        log.info("Cart deleted successfully");
    }

    @Override
    @Transactional(readOnly = true)
    public CartDto getCartByUserId(Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user"));
        return cartMapper.toDto(cart);
    }
}