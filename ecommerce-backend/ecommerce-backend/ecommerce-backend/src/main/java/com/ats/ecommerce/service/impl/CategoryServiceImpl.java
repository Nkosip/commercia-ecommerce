package com.ats.ecommerce.service.impl;

import com.ats.ecommerce.dto.category.CategoryDto;
import com.ats.ecommerce.entity.Category;
import com.ats.ecommerce.exception.DuplicateResourceException;
import com.ats.ecommerce.exception.ResourceNotFoundException;
import com.ats.ecommerce.mapper.CategoryMapper;
import com.ats.ecommerce.repository.CategoryRepository;
import com.ats.ecommerce.service.CategoryService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Override
    public CategoryDto createCategory(CategoryDto categoryDto) {

        if (categoryRepository.existsByNameIgnoreCase(categoryDto.getName())) {
            throw new DuplicateResourceException(
                    "Category with name '" + categoryDto.getName() + "' already exists"
            );
        }

        Category category = categoryMapper.toEntity(categoryDto);

        Category savedCategory = categoryRepository.save(category);

        return categoryMapper.toDto(savedCategory);
    }

    @Override
    public List<CategoryDto> getAllCategories() {

        return categoryRepository.findAll()
                .stream()
                .map(categoryMapper::toDto)
                .toList();
    }

    @Override
    public CategoryDto getCategoryById(Long id) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Category not found with id: " + id
                        )
                );

        return categoryMapper.toDto(category);
    }

    @Override
    public CategoryDto updateCategory(Long id, CategoryDto categoryDto) {

        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Category not found with id: " + id
                        )
                );

        // Check for duplicate name (ignore same category)
        if (!existingCategory.getName().equalsIgnoreCase(categoryDto.getName())
                && categoryRepository.existsByNameIgnoreCase(categoryDto.getName())) {

            throw new DuplicateResourceException(
                    "Category with name '" + categoryDto.getName() + "' already exists"
            );
        }

        // Update fields
        existingCategory.setName(categoryDto.getName());
        existingCategory.setDescription(categoryDto.getDescription());

        Category updatedCategory = categoryRepository.save(existingCategory);

        return categoryMapper.toDto(updatedCategory);
    }

    @Override
    public void deleteCategory(Long id) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Category not found with id: " + id
                        )
                );

        /* Optional safety check (recommended)
        if (!category.getProducts().isEmpty()) {
            throw new BusinessException(
                    "Cannot delete category with associated products"
            );
        }*/

        categoryRepository.delete(category);
    }

}///////////////////////////////////
