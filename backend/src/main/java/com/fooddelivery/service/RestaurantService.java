package com.fooddelivery.service;

import com.fooddelivery.dto.RestaurantDto;
import com.fooddelivery.entity.Restaurant;
import com.fooddelivery.entity.User;
import com.fooddelivery.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RestaurantService {
    
    private final RestaurantRepository restaurantRepository;
    private final UserService userService;
    
    public List<RestaurantDto> getAllRestaurants() {
        return restaurantRepository.findByIsActiveTrueAndIsOpenTrue(Pageable.unpaged())
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public Page<RestaurantDto> getRestaurants(Pageable pageable) {
        return restaurantRepository.findByIsActiveTrueAndIsOpenTrue(pageable)
                .map(this::convertToDto);
    }
    
    public RestaurantDto getRestaurantById(Long id) {
        Restaurant restaurant = restaurantRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
        return convertToDto(restaurant);
    }
    
    public List<RestaurantDto> searchRestaurants(String searchTerm) {
        return restaurantRepository.searchRestaurants(searchTerm)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<RestaurantDto> getRestaurantsByCuisine(String cuisine) {
        return restaurantRepository.findByCuisineContainingIgnoreCaseAndIsActiveTrueAndIsOpenTrue(cuisine)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<RestaurantDto> getRestaurantsByRating(Double minRating) {
        return restaurantRepository.findByRatingGreaterThanEqual(minRating)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<RestaurantDto> getRestaurantsByDeliveryTime(Integer maxDeliveryTime) {
        return restaurantRepository.findByDeliveryTimeLessThanEqual(maxDeliveryTime)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<RestaurantDto> getRestaurantsByOwner(Long ownerId) {
        return restaurantRepository.findByOwnerIdAndIsActiveTrue(ownerId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    private RestaurantDto convertToDto(Restaurant restaurant) {
        RestaurantDto dto = new RestaurantDto();
        dto.setId(restaurant.getId());
        dto.setName(restaurant.getName());
        dto.setDescription(restaurant.getDescription());
        dto.setAddress(restaurant.getAddress());
        dto.setPhone(restaurant.getPhone());
        dto.setEmail(restaurant.getEmail());
        dto.setCuisine(restaurant.getCuisine());
        dto.setImageUrl(restaurant.getImageUrl());
        dto.setRating(restaurant.getRating());
        dto.setReviewCount(restaurant.getReviewCount());
        dto.setIsActive(restaurant.getIsActive());
        dto.setIsOpen(restaurant.getIsOpen());
        dto.setDeliveryTime(restaurant.getDeliveryTime());
        dto.setDeliveryFee(restaurant.getDeliveryFee());
        dto.setMinimumOrder(restaurant.getMinimumOrder());
        dto.setCreatedAt(restaurant.getCreatedAt());
        dto.setUpdatedAt(restaurant.getUpdatedAt());
        
        if (restaurant.getOwner() != null) {
            dto.setOwnerId(restaurant.getOwner().getId());
            dto.setOwnerName(restaurant.getOwner().getFirstName() + " " + restaurant.getOwner().getLastName());
        }
        
        return dto;
    }
}