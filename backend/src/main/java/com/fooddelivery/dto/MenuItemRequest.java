package com.fooddelivery.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenuItemRequest {
	@NotBlank(message = "Menu item name is required")
	@Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
	private String name;
	
	@NotBlank(message = "Description is required")
	@Size(min = 5, max = 500, message = "Description must be between 5 and 500 characters")
	private String description;
	
	@DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
	private double price;
	
	private String imageUrl;
	
	private boolean vegetarian;
	private boolean spicy;
	private boolean available = true;
	
	@Min(value = 0, message = "Preparation time must be 0 or more")
	private int preparationTime = 15;
	
	@NotNull(message = "Restaurant ID is required")
	private Long restaurantId;
	
	@NotNull(message = "Category ID is required")
	private Long categoryId;
}