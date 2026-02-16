package com.ats.ecommerce.service;

import com.ats.ecommerce.dto.cart.CartDto;
import com.ats.ecommerce.dto.cart.CartItemDto;

public interface CartItemService {
    CartDto addItem(Long cartId, CartItemDto dto);
    CartDto updateItem(Long cartId, CartItemDto dto);
    CartDto removeItem(Long cartId, Long productId);
}
