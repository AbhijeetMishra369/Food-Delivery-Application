package com.fooddelivery.controller;

import com.fooddelivery.dto.CategoryRequest;
import com.fooddelivery.entity.Category;
import com.fooddelivery.repository.CategoryRepository;
import com.fooddelivery.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CategoryController {
	
	private final CategoryRepository categoryRepository;
	private final CategoryService categoryService;
	
	public static class CategoryDto {
		public Long id;
		public String name;
		public String description;
		public String imageUrl;
	}
	
	@GetMapping
	public ResponseEntity<List<CategoryDto>> getActiveCategories() {
		List<Category> categories = categoryRepository.findByIsActiveTrueOrderByNameAsc();
		List<CategoryDto> dtos = categories.stream().map(c -> {
			CategoryDto dto = new CategoryDto();
			dto.id = c.getId();
			dto.name = c.getName();
			dto.description = c.getDescription();
			dto.imageUrl = c.getImageUrl();
			return dto;
		}).collect(Collectors.toList());
		return ResponseEntity.ok(dtos);
	}
	
	@PostMapping
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<Category> createCategory(@Valid @RequestBody CategoryRequest request) {
		Category created = categoryService.create(request);
		return ResponseEntity.ok(created);
	}
	
	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<Category> updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryRequest request) {
		Category updated = categoryService.update(id, request);
		return ResponseEntity.ok(updated);
	}
	
	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
		categoryService.delete(id);
		return ResponseEntity.noContent().build();
	}
}