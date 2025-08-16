package com.fooddelivery.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenuItemDto {
    
    private Long id;
    private String name;
    private String description;
    private Double price;
    private String imageUrl;
    private Boolean isVegetarian;
    private Boolean isSpicy;
    private Boolean isAvailable;
    private Integer preparationTime;
    private Long restaurantId;
    private String restaurantName;
    private Long categoryId;
    private String categoryName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}