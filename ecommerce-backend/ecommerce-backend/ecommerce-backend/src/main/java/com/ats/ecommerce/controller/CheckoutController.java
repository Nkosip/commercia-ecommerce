package com.ats.ecommerce.controller;

import com.ats.ecommerce.dto.order.OrderDto;
import com.ats.ecommerce.security.UserDetailsImpl;
import com.ats.ecommerce.service.CheckoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/checkout")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class CheckoutController {

    private final CheckoutService checkoutService;

    @PostMapping("/{cartId}")
    public ResponseEntity<OrderDto> checkout(
            @PathVariable Long cartId,
            @AuthenticationPrincipal UserDetailsImpl user
    ) {
        return ResponseEntity.ok(
                checkoutService.checkout(cartId, user.getUser())
        );
    }
}

