package com.fooddelivery.service;

import com.fooddelivery.dto.CategoryRequest;
import com.fooddelivery.entity.Category;
import com.fooddelivery.exception.NotFoundException;
import com.fooddelivery.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
	private final CategoryRepository categoryRepository;
	
	public List<Category> getActiveCategories() {
		return categoryRepository.findByIsActiveTrueOrderByNameAsc();
	}
	
	public Category create(CategoryRequest request) {
		Category category = new Category();
		applyRequest(category, request);
		return categoryRepository.save(category);
	}
	
	public Category update(Long id, CategoryRequest request) {
		Category category = categoryRepository.findById(id)
				.orElseThrow(() -> new NotFoundException("Category not found"));
		applyRequest(category, request);
		return categoryRepository.save(category);
	}
	
	public void delete(Long id) {
		Category category = categoryRepository.findById(id)
				.orElseThrow(() -> new NotFoundException("Category not found"));
		categoryRepository.delete(category);
	}
	
	private void applyRequest(Category category, CategoryRequest request) {
		category.setName(request.getName());
		category.setDescription(request.getDescription());
		category.setImageUrl(request.getImageUrl());
		if (request.getActive() != null) category.setActive(request.getActive());
	}
}