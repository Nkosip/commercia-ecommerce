package com.ats.ecommerce.service.impl;

import com.ats.ecommerce.dto.order.OrderDto;
import com.ats.ecommerce.entity.*;
import com.ats.ecommerce.entity.enums.OrderStatus;
import com.ats.ecommerce.exception.ResourceNotFoundException;
import com.ats.ecommerce.mapper.OrderMapper;
import com.ats.ecommerce.repository.OrderRepository;
import com.ats.ecommerce.repository.ProductRepository;
import com.ats.ecommerce.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final OrderMapper orderMapper;

    @Override
    public Order placeOrder(User user, Cart cart) {

        Order order = new Order();
        order.setUser(user);

        List<OrderItem> items = cart.getItems().stream().map(ci -> {
            Product product = ci.getProduct();

            // TODO: Implement inventory management
            // Once inventory system is fully implemented, uncomment the following:
            /*
            // Check if inventory exists
            if (product.getInventory() == null) {
                throw new RuntimeException("Product " + product.getName() + " has no inventory record. Please contact support.");
            }

            // Check stock availability
            if (product.getInventory().getQuantity() < ci.getQuantity()) {
                throw new ResourceNotFoundException("Insufficient stock for " + product.getName());
            }

            // Reduce inventory quantity
            product.getInventory().setQuantity(
                    product.getInventory().getQuantity() - ci.getQuantity()
            );
            */

            return new OrderItem(
                    null,
                    order,
                    product,
                    ci.getQuantity(),
                    product.getPrice()
            );
        }).toList();

        order.setItems(items);

        order.setTotalAmount(
                items.stream()
                        .map(i -> i.getPrice()
                                .multiply(BigDecimal.valueOf(i.getQuantity())))
                        .reduce(BigDecimal.ZERO, BigDecimal::add)
        );

        return orderRepository.save(order);
    }

    @Override
    public OrderDto getOrder(Long orderId) {
        return orderRepository.findById(orderId)
                .map(orderMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
    }

    @Override
    public List<OrderDto> getUserOrders(Long userId) {
        return orderRepository.findByUserId(userId)
                .stream()
                .map(orderMapper::toDto)
                .toList();
    }

    @Override
    public void cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        order.setStatus(OrderStatus.CANCELLED);
    }
}