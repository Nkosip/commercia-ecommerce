package com.ats.ecommerce.service;

import com.ats.ecommerce.dto.product.ProductRequestDto;
import com.ats.ecommerce.dto.product.ProductResponseDto;

import java.util.List;

public interface ProductService {
    ProductResponseDto createProduct(ProductRequestDto productRequestDto);

    List<ProductResponseDto> getProducts(String name, Long categoryId, Double minPrice, Double maxPrice, Boolean active);

    ProductResponseDto getProductById(Long id);

    ProductResponseDto updateProduct(Long id, ProductRequestDto requestDto);

    ProductResponseDto updateProductStatus(Long id, Boolean active);

    void deleteProduct(Long id);
}
