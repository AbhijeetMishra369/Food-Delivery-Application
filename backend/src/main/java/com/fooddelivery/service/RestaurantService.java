package com.fooddelivery.service;

import com.fooddelivery.dto.RestaurantDto;
import com.fooddelivery.dto.RestaurantRequest;
import com.fooddelivery.entity.Restaurant;
import com.fooddelivery.exception.NotFoundException;
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
	
	public List<RestaurantDto> getAllRestaurants() {
		return restaurantRepository.findByIsActiveTrueAndIsOpenTrue()
				.stream()
				.map(this::convertToDto)
				.collect(Collectors.toList());
	}
	
	public Page<RestaurantDto> getAllRestaurants(Pageable pageable) {
		return restaurantRepository.findByIsActiveTrueAndIsOpenTrue(pageable)
				.map(restaurant -> {
					// For pageable queries, we need to handle lazy loading differently
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
					dto.setActive(restaurant.isActive());
					dto.setOpen(restaurant.isOpen());
					dto.setDeliveryTime(restaurant.getDeliveryTime());
					dto.setDeliveryFee(restaurant.getDeliveryFee());
					dto.setMinimumOrder(restaurant.getMinimumOrder());
					dto.setCreatedAt(restaurant.getCreatedAt());
					dto.setUpdatedAt(restaurant.getUpdatedAt());
					
					// Handle owner information safely
					try {
						if (restaurant.getOwner() != null) {
							dto.setOwnerId(restaurant.getOwner().getId());
							dto.setOwnerName(restaurant.getOwner().getFirstName() + " " + restaurant.getOwner().getLastName());
						}
					} catch (Exception e) {
						// If lazy loading fails, just set the owner ID if available
						dto.setOwnerId(restaurant.getOwner() != null ? restaurant.getOwner().getId() : null);
						dto.setOwnerName("Owner information not available");
					}
					
					return dto;
				});
	}
	
	public RestaurantDto getRestaurantById(Long id) {
		Restaurant restaurant = restaurantRepository.findByIdAndIsActiveTrue(id)
				.orElseThrow(() -> new NotFoundException("Restaurant not found"));
		return convertToDto(restaurant);
	}
	
	public List<RestaurantDto> searchRestaurants(String query) {
		return restaurantRepository.searchByNameOrCuisine(query)
				.stream()
				.filter(r -> r.isActive() && r.isOpen())
				.map(this::convertToDto)
				.collect(Collectors.toList());
	}
	
	public List<RestaurantDto> getRestaurantsByCuisine(String cuisine) {
		return restaurantRepository.findByCuisine(cuisine)
				.stream()
				.filter(r -> r.isActive() && r.isOpen())
				.map(this::convertToDto)
				.collect(Collectors.toList());
	}
	
	public List<RestaurantDto> getRestaurantsByRating(double minRating) {
		return restaurantRepository.findByMinimumRating(minRating)
				.stream()
				.filter(r -> r.isActive() && r.isOpen())
				.map(this::convertToDto)
				.collect(Collectors.toList());
	}
	
	public List<RestaurantDto> getRestaurantsByDeliveryTime(int maxDeliveryTime) {
		return restaurantRepository.findByMaxDeliveryTime(maxDeliveryTime)
				.stream()
				.filter(r -> r.isActive() && r.isOpen())
				.map(this::convertToDto)
				.collect(Collectors.toList());
	}
	
	public List<RestaurantDto> getRestaurantsByOwner(Long ownerId) {
		return restaurantRepository.findByOwnerId(ownerId)
				.stream()
				.filter(r -> r.isActive() && r.isOpen())
				.map(this::convertToDto)
				.collect(Collectors.toList());
	}
	
	public RestaurantDto createRestaurant(RestaurantRequest request) {
		Restaurant restaurant = new Restaurant();
		applyRequest(restaurant, request);
		Restaurant saved = restaurantRepository.save(restaurant);
		return convertToDto(saved);
	}
	
	public RestaurantDto updateRestaurant(Long id, RestaurantRequest request) {
		Restaurant restaurant = restaurantRepository.findById(id)
				.orElseThrow(() -> new NotFoundException("Restaurant not found"));
		applyRequest(restaurant, request);
		Restaurant saved = restaurantRepository.save(restaurant);
		return convertToDto(saved);
	}
	
	public void deleteRestaurant(Long id) {
		Restaurant restaurant = restaurantRepository.findById(id)
				.orElseThrow(() -> new NotFoundException("Restaurant not found"));
		restaurantRepository.delete(restaurant);
	}
	
	private void applyRequest(Restaurant restaurant, RestaurantRequest request) {
		restaurant.setName(request.getName());
		restaurant.setDescription(request.getDescription());
		restaurant.setAddress(request.getAddress());
		restaurant.setPhone(request.getPhone());
		restaurant.setEmail(request.getEmail());
		restaurant.setCuisine(request.getCuisine());
		restaurant.setImageUrl(request.getImageUrl());
		restaurant.setDeliveryTime(request.getDeliveryTime());
		restaurant.setDeliveryFee(request.getDeliveryFee());
		restaurant.setMinimumOrder(request.getMinimumOrder());
		if (request.getActive() != null) restaurant.setActive(request.getActive());
		if (request.getOpen() != null) restaurant.setOpen(request.getOpen());
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
		dto.setActive(restaurant.isActive());
		dto.setOpen(restaurant.isOpen());
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