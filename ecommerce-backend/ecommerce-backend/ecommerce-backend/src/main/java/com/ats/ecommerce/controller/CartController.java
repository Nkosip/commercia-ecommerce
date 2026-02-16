package com.ats.ecommerce.controller;

import com.ats.ecommerce.dto.cart.CartDto;
import com.ats.ecommerce.dto.cart.CartItemDto;
import com.ats.ecommerce.entity.Cart;
import com.ats.ecommerce.exception.ResourceNotFoundException;
import com.ats.ecommerce.service.CartItemService;
import com.ats.ecommerce.service.CartService;
import com.ats.ecommerce.util.SecurityUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class CartController {

    private final CartService cartService;
    private final CartItemService cartItemService;
    private final SecurityUtil securityUtil;

    @PostMapping
    public ResponseEntity<Long> createCart() {
        Long userId = securityUtil.getCurrentUser().getId();
        Cart cart = cartService.createCart(userId);
        return ResponseEntity.ok(cart.getId());
    }

    @GetMapping("/{cartId}/my-cart")
    public ResponseEntity<CartDto> getCart(@PathVariable Long cartId) {
        return ResponseEntity.ok(cartService.getCart(cartId));
    }

    @GetMapping("/my-cart")
    public ResponseEntity<CartDto> getMyCart() {
        Long userId = securityUtil.getCurrentUser().getId();
        
        try {
            CartDto cart = cartService.getCartByUserId(userId);
            return ResponseEntity.ok(cart);
        } catch (ResourceNotFoundException e) {
            // User doesn't have a cart yet - return 404
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{cartId}/items")
    public ResponseEntity<CartDto> addItem(
            @PathVariable Long cartId,
            @RequestBody @Valid CartItemDto dto
    ) {
        return ResponseEntity.ok(cartItemService.addItem(cartId, dto));
    }

    @PutMapping("/{cartId}/items")
    public ResponseEntity<CartDto> updateItem(
            @PathVariable Long cartId,
            @RequestBody @Valid CartItemDto dto
    ) {
        return ResponseEntity.ok(cartItemService.updateItem(cartId, dto));
    }

    @DeleteMapping("/{cartId}/items/{productId}")
    public ResponseEntity<CartDto> removeItem(
            @PathVariable Long cartId,
            @PathVariable Long productId
    ) {
        return ResponseEntity.ok(cartItemService.removeItem(cartId, productId));
    }

    @DeleteMapping("/{cartId}/clear")
    public ResponseEntity<Void> clearCart(@PathVariable Long cartId) {
        cartService.clearCart(cartId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{cartId}")
    public ResponseEntity<Void> deleteCart(@PathVariable Long cartId) {
        cartService.deleteCart(cartId);
        return ResponseEntity.noContent().build();
    }
}