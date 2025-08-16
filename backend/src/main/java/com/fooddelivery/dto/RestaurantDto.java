package com.fooddelivery.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantDto {
    
    private Long id;
    private String name;
    private String description;
    private String address;
    private String phone;
    private String email;
    private String cuisine;
    private String imageUrl;
    private Double rating;
    private Integer reviewCount;
    private Boolean isActive;
    private Boolean isOpen;
    private Integer deliveryTime;
    private Double deliveryFee;
    private Double minimumOrder;
    private Long ownerId;
    private String ownerName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}