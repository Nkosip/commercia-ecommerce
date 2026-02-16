package com.ats.ecommerce.mapper;

import com.ats.ecommerce.dto.product.ProductRequestDto;
import com.ats.ecommerce.dto.product.ProductResponseDto;
import com.ats.ecommerce.entity.Category;
import com.ats.ecommerce.entity.Inventory;
import com.ats.ecommerce.entity.Product;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ProductMapper {

    private final CategoryMapper categoryMapper;

    public ProductResponseDto toDto(Product product) {
        if (product == null) return null;

        return new ProductResponseDto(
                product.getId(),
                product.getSku(),
                product.getName(),
                product.getDescription(),
                product.getImageUrl(),
                product.getPrice(),
                product.isActive(),
                categoryMapper.toDto(product.getCategory()),
                product.getInventory() != null
                        ? product.getInventory().getQuantity()
                        : 0
        );
    }

    public Product toEntity(ProductRequestDto dto, Category category) {
        if (dto == null) return null;

        Product product = new Product();
        product.setSku(dto.getSku());
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setActive(true);
        product.setCategory(category);

        // Inventory is created and linked here
        Inventory inventory = new Inventory();
        inventory.setQuantity(dto.getQuantity());
        inventory.setProduct(product);

        product.setInventory(inventory);

        return product;
    }
}

