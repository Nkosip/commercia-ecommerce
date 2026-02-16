package com.ats.ecommerce.controller;

import com.ats.ecommerce.dto.product.ProductRequestDto;
import com.ats.ecommerce.dto.product.ProductResponseDto;
import com.ats.ecommerce.service.ProductService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductResponseDto> createProduct(
            @Valid @RequestBody ProductRequestDto productRequestDto
    ) {
        ProductResponseDto createdProduct = productService.createProduct(productRequestDto);
        return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
    }

    /**
     * GET /products?name=&categoryId=&minPrice=&maxPrice=&active=
     */
    @GetMapping
    public ResponseEntity<List<ProductResponseDto>> getProducts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Boolean active
    ) {
        List<ProductResponseDto> products = productService.getProducts(name, categoryId, minPrice, maxPrice, active);
        return ResponseEntity.ok(products);
    }

    /**
     * GET /products/{id} - Get product details by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDto> getProductById(@PathVariable Long id) {
        ProductResponseDto product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    /**
     * PUT /products/{id} - Update a product
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductResponseDto> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequestDto requestDto
    ) {
        ProductResponseDto updatedProduct = productService.updateProduct(id, requestDto);
        return ResponseEntity.ok(updatedProduct);
    }

    /**
     * PUT /products/{id}/status - Enable or disable a product
     */
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductResponseDto> updateProductStatus(
            @PathVariable Long id,
            @RequestBody StatusRequest statusRequest
    ) {
        ProductResponseDto updatedProduct = productService.updateProductStatus(id, statusRequest.getEnabled());
        return ResponseEntity.ok(updatedProduct);
    }

    // Inner class for request body
    @Data
    public static class StatusRequest {
        @NotNull
        private Boolean enabled;
    }

    /**
     * DELETE /products/{id} - Delete a product by ID
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build(); // 204 No Content
    }

}

