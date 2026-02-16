package com.ats.ecommerce.controller;

import com.ats.ecommerce.dto.admin.AdminDashboardDto;
import com.ats.ecommerce.dto.order.OrderDto;
import com.ats.ecommerce.dto.product.ProductResponseDto;
import com.ats.ecommerce.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    public AdminDashboardDto getDashboard() {
        return adminService.getDashboardStats();
    }

    @GetMapping("/orders")
    public List<OrderDto> getAllOrders() {
        return adminService.getAllOrders();
    }

    @GetMapping("/products")
    public List<ProductResponseDto> getAllProducts() {
        return adminService.getAllProducts();
    }


}
