package com.ats.ecommerce.service.impl;

import com.ats.ecommerce.dto.cart.CartDto;
import com.ats.ecommerce.dto.cart.CartItemDto;
import com.ats.ecommerce.entity.Cart;
import com.ats.ecommerce.entity.CartItem;
import com.ats.ecommerce.entity.Product;
import com.ats.ecommerce.exception.ResourceNotFoundException;
import com.ats.ecommerce.mapper.CartMapper;
import com.ats.ecommerce.repository.CartItemRepository;
import com.ats.ecommerce.repository.ProductRepository;
import com.ats.ecommerce.service.CartItemService;
import com.ats.ecommerce.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class CartItemServiceImpl implements CartItemService {

    private final CartService cartService;
    private final ProductRepository productRepository;
    private final CartItemRepository cartItemRepository;
    private final CartMapper cartMapper;

    @Override
    public CartDto addItem(Long cartId, CartItemDto dto) {
        Cart cart = cartService.getCartEntity(cartId);

        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        CartItem item = cart.getItems()
                .stream()
                .filter(i -> i.getProduct().getId().equals(dto.getProductId()))
                .findFirst()
                .orElse(new CartItem());

        if (item.getId() == null) {
            item.setProduct(product);
            item.setQuantity(dto.getQuantity());
            item.setUnitPrice(product.getPrice());
            cart.getItems().add(item);
            item.setCart(cart);
        } else {
            item.setQuantity(item.getQuantity() + dto.getQuantity());
        }

        item.setTotalPrice();
        cartItemRepository.save(item);

        return cartMapper.toDto(cart);
    }

    @Override
    public CartDto updateItem(Long cartId, CartItemDto dto) {
        Cart cart = cartService.getCartEntity(cartId);

        cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(dto.getProductId()))
                .findFirst()
                .ifPresent(item -> {
                    item.setQuantity(dto.getQuantity());
                    item.setUnitPrice(item.getProduct().getPrice());
                    item.setTotalPrice();
                });

        return cartMapper.toDto(cart);
    }

    @Override
    public CartDto removeItem(Long cartId, Long productId) {
        Cart cart = cartService.getCartEntity(cartId);

        CartItem item = cart.getItems()
                .stream()
                .filter(i -> i.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));

        cart.getItems().remove(item);
        cartItemRepository.delete(item);

        return cartMapper.toDto(cart);
    }
}

