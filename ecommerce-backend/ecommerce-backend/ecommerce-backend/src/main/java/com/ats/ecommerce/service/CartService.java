package com.ats.ecommerce.service;

import com.ats.ecommerce.dto.cart.CartDto;
import com.ats.ecommerce.entity.Cart;

public interface CartService {
    
    Cart createCart(Long userId);
    
    Cart getCartEntity(Long cartId);
    
    CartDto getCart(Long cartId);
    
    void clearCart(Long cartId);
    
    void deleteCart(Long cartId);
    
    CartDto getCartByUserId(Long userId);
}