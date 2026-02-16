package com.ats.ecommerce.service.impl;

import com.ats.ecommerce.dto.product.ProductRequestDto;
import com.ats.ecommerce.dto.product.ProductResponseDto;
import com.ats.ecommerce.entity.Category;
import com.ats.ecommerce.entity.Product;
import com.ats.ecommerce.exception.DuplicateResourceException;
import com.ats.ecommerce.exception.ResourceNotFoundException;
import com.ats.ecommerce.mapper.ProductMapper;
import com.ats.ecommerce.repository.CategoryRepository;
import com.ats.ecommerce.repository.ProductRepository;
import com.ats.ecommerce.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;

    @Override
    public ProductResponseDto createProduct(ProductRequestDto requestDto) {

        // 1. Check SKU uniqueness
        if (productRepository.existsBySkuIgnoreCase(requestDto.getSku())) {
            throw new DuplicateResourceException(
                    "Product with SKU '" + requestDto.getSku() + "' already exists"
            );
        }

        // 2. Fetch category
        Category category = categoryRepository.findById(requestDto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found with id: " + requestDto.getCategoryId()
                ));

        // 3. Map DTO → Entity (includes Inventory creation)
        Product product = productMapper.toEntity(requestDto, category);

        // 4. Save product (Inventory is saved via cascade)
        Product savedProduct = productRepository.save(product);

        // 5. Map Entity → Response DTO
        return productMapper.toDto(savedProduct);
    }

    @Override
    public List<ProductResponseDto> getProducts(String name, Long categoryId, Double minPrice, Double maxPrice, Boolean active) {
        // Convert Double to BigDecimal for JPA query
        BigDecimal min = minPrice != null ? BigDecimal.valueOf(minPrice) : null;
        BigDecimal max = maxPrice != null ? BigDecimal.valueOf(maxPrice) : null;

        List<Product> products = productRepository.findProductsByFilters(name, categoryId, min, max, active);

        return products.stream()
                .map(productMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public ProductResponseDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Product not found with id: " + id
                ));

        return productMapper.toDto(product);
    }

    @Override
    public ProductResponseDto updateProduct(Long id, ProductRequestDto requestDto) {

        // 1. Fetch existing product
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        // 2. Check if SKU is being updated to a duplicate
        if (!product.getSku().equalsIgnoreCase(requestDto.getSku()) &&
                productRepository.existsBySkuIgnoreCase(requestDto.getSku())) {
            throw new DuplicateResourceException("Product with SKU '" + requestDto.getSku() + "' already exists");
        }

        // 3. Fetch category
        Category category = categoryRepository.findById(requestDto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found with id: " + requestDto.getCategoryId()
                ));

        // 4. Update product fields
        product.setSku(requestDto.getSku());
        product.setName(requestDto.getName());
        product.setDescription(requestDto.getDescription());
        product.setPrice(requestDto.getPrice());
        product.setCategory(category);

        // 5. Update inventory
        if (product.getInventory() != null) {
            product.getInventory().setQuantity(requestDto.getQuantity());
        }

        // 6. Save product
        Product updatedProduct = productRepository.save(product);

        // 7. Return mapped response DTO
        return productMapper.toDto(updatedProduct);
    }

    @Override
    public ProductResponseDto updateProductStatus(Long id, Boolean active) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        product.setActive(active);

        Product updatedProduct = productRepository.save(product);

        return productMapper.toDto(updatedProduct);
    }

    @Override
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        productRepository.delete(product);
    }

}



