package com.ats.ecommerce.service.impl;

import com.ats.ecommerce.dto.admin.AdminDashboardDto;
import com.ats.ecommerce.dto.order.OrderDto;
import com.ats.ecommerce.dto.order.OrderResponseDto;
import com.ats.ecommerce.dto.product.ProductResponseDto;
import com.ats.ecommerce.mapper.OrderMapper;
import com.ats.ecommerce.mapper.ProductMapper;
import com.ats.ecommerce.repository.OrderRepository;
import com.ats.ecommerce.repository.ProductRepository;
import com.ats.ecommerce.repository.UserRepository;
import com.ats.ecommerce.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderMapper orderMapper;
    private final ProductMapper productMapper;

    @Override
    public AdminDashboardDto getDashboardStats() {
        return new AdminDashboardDto(
                orderRepository.count(),
                orderRepository.getTotalSales(),
                userRepository.count()
        );
    }

    @Override
    public List<OrderDto> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(orderMapper::toDto)
                .toList();
    }

    @Override
    public List<ProductResponseDto> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(productMapper::toDto)
                .toList();
    }
}
