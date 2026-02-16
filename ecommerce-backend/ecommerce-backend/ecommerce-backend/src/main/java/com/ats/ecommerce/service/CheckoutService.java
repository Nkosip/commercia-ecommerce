package com.ats.ecommerce.service;

import com.ats.ecommerce.dto.order.OrderDto;
import com.ats.ecommerce.entity.User;

public interface CheckoutService {
    OrderDto checkout(Long cartId, User user);
}

