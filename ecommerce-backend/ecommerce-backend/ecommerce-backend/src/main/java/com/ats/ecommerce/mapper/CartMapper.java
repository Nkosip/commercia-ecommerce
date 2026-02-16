package com.ats.ecommerce.mapper;

import com.ats.ecommerce.dto.cart.CartDto;
import com.ats.ecommerce.dto.cart.CartItemDto;
import com.ats.ecommerce.entity.Cart;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CartMapper {

    public CartDto toDto(Cart cart) {
        if (cart == null) return null;

        List<CartItemDto> items = cart.getItems()
                .stream()
                .map(item -> new CartItemDto(
                        item.getProduct().getId(),
                        item.getQuantity()
                ))
                .toList();

        return new CartDto(
                cart.getId(),
                items
        );
    }
}

