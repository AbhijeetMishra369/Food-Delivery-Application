package com.fooddelivery.controller;

import com.fooddelivery.entity.Category;
import com.fooddelivery.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CategoryController {
    
    private final CategoryRepository categoryRepository;
    
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
}