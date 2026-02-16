package com.ats.ecommerce.dto.product;

import com.ats.ecommerce.dto.category.CategoryDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponseDto {

    private Long id;
    private String sku;
    private String name;
    private String description;
    private String imageUrl;
    private BigDecimal price;
    private boolean active;
    

    private CategoryDto category;
    private Integer availableQuantity;

}
