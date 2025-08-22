package com.fooddelivery.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantRequest {
	@NotBlank(message = "Restaurant name is required")
	@Size(min = 2, max = 100, message = "Restaurant name must be between 2 and 100 characters")
	private String name;
	
	@NotBlank(message = "Description is required")
	@Size(min = 10, max = 500, message = "Description must be between 10 and 500 characters")
	private String description;
	
	@NotBlank(message = "Address is required")
	@Size(min = 10, max = 200, message = "Address must be between 10 and 200 characters")
	private String address;
	
	@NotBlank(message = "Phone is required")
	@Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be 10 digits")
	private String phone;
	
	@NotBlank(message = "Email is required")
	@Email(message = "Invalid email format")
	private String email;
	
	@NotBlank(message = "Cuisine is required")
	private String cuisine;
	
	private String imageUrl;
	
	@Min(value = 0, message = "Delivery time must be 0 or more")
	private int deliveryTime = 30;
	
	@DecimalMin(value = "0.0", inclusive = true, message = "Delivery fee cannot be negative")
	private double deliveryFee = 5.0;
	
	@DecimalMin(value = "0.0", inclusive = true, message = "Minimum order cannot be negative")
	private double minimumOrder = 10.0;
	
	private Boolean active = true;
	private Boolean open = true;
}