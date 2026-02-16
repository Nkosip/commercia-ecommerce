package com.ats.ecommerce.service;

import com.ats.ecommerce.dto.order.OrderDto;
import com.ats.ecommerce.entity.Cart;
import com.ats.ecommerce.entity.Order;
import com.ats.ecommerce.entity.User;

import java.util.List;

public interface OrderService {
    Order placeOrder(User user, Cart cart);
    OrderDto getOrder(Long orderId);
    List<OrderDto> getUserOrders(Long userId);
    void cancelOrder(Long orderId);
}

