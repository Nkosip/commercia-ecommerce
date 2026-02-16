package com.ats.ecommerce.service;


import com.ats.ecommerce.dto.admin.AdminDashboardDto;
import com.ats.ecommerce.dto.order.OrderDto;
import com.ats.ecommerce.dto.order.OrderResponseDto;
import com.ats.ecommerce.dto.product.ProductResponseDto;

import java.util.List;

public interface AdminService {

    AdminDashboardDto getDashboardStats();

    List<OrderDto> getAllOrders();

    List<ProductResponseDto> getAllProducts();
}

