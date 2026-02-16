package com.ats.ecommerce.mapper;

import com.ats.ecommerce.dto.order.OrderDto;
import com.ats.ecommerce.dto.order.OrderItemDto;
import com.ats.ecommerce.dto.order.OrderResponseDto;
import com.ats.ecommerce.entity.Order;
import org.springframework.stereotype.Component;

import java.util.List;

/**Component
public class OrderMapper {

    public OrderResponseDto toDto(Order order) {
        if (order == null) return null;

        List<OrderItemDto> items = order.getItems()
                .stream()
                .map(item -> new OrderItemDto(
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getQuantity(),
                        item.getPrice()
                ))
                .toList();

        return new OrderResponseDto(
                order.getId(),
                order.getStatus().name(),
                order.getTotalAmount(),
                items,
                order.getCreatedAt()
        );
    }
}**/

@Component
public class OrderMapper {

    public OrderDto toDto(Order order) {
        return new OrderDto(
                order.getId(),
                order.getStatus().name(),
                order.getTotalAmount(),
                order.getItems().stream()
                        .map(i -> new OrderItemDto(
                                i.getProduct().getId(),
                                i.getQuantity(),
                                i.getPrice()
                        ))
                        .toList()
        );
    }
}


