package com.fooddelivery.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryRequest {
	@NotBlank(message = "Category name is required")
	@Size(min = 2, max = 100, message = "Category name must be between 2 and 100 characters")
	private String name;
	
	@NotBlank(message = "Description is required")
	@Size(min = 5, max = 300, message = "Description must be between 5 and 300 characters")
	private String description;
	
	private String imageUrl;
	
	private Boolean active = true;
}