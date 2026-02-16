package com.ats.ecommerce.dto.admin;


import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class AdminDashboardDto {
    private Long totalOrders;
    private BigDecimal totalSales;
    private Long totalUsers;
}

