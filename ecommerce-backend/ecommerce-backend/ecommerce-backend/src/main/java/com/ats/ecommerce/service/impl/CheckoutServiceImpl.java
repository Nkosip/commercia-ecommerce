package com.ats.ecommerce.service.impl;

import com.ats.ecommerce.dto.order.OrderDto;
import com.ats.ecommerce.entity.Cart;
import com.ats.ecommerce.entity.Order;
import com.ats.ecommerce.entity.User;
import com.ats.ecommerce.mapper.OrderMapper;
import com.ats.ecommerce.repository.CartRepository;
import com.ats.ecommerce.service.CartService;
import com.ats.ecommerce.service.CheckoutService;
import com.ats.ecommerce.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class CheckoutServiceImpl implements CheckoutService {

    private final CartService cartService;
    private final OrderService orderService;
    private final CartRepository cartRepository;
    private final OrderMapper orderMapper;

    @Override
    public OrderDto checkout(Long cartId, User user) {
        Cart cart = cartService.getCartEntity(cartId);

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = orderService.placeOrder(user, cart);

        cart.getItems().clear();
        cartRepository.save(cart);

        return orderMapper.toDto(order);
    }
}
