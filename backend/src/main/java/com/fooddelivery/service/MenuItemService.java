package com.fooddelivery.service;

import com.fooddelivery.dto.MenuItemDto;
import com.fooddelivery.dto.MenuItemRequest;
import com.fooddelivery.entity.Category;
import com.fooddelivery.entity.MenuItem;
import com.fooddelivery.entity.Restaurant;
import com.fooddelivery.exception.NotFoundException;
import com.fooddelivery.repository.MenuItemRepository;
import com.fooddelivery.repository.RestaurantRepository;
import com.fooddelivery.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MenuItemService {
	
	private final MenuItemRepository menuItemRepository;
	private final RestaurantRepository restaurantRepository;
	private final CategoryRepository categoryRepository;
	
	public List<MenuItemDto> getMenuItemsByRestaurant(Long restaurantId) {
		return menuItemRepository.findByRestaurantIdAndIsAvailableTrue(restaurantId)
				.stream()
				.map(this::convertToDto)
				.collect(Collectors.toList());
	}
	
	public List<MenuItemDto> getMenuItemsByRestaurantAndCategory(Long restaurantId, Long categoryId) {
		return menuItemRepository.findByRestaurantIdAndCategoryIdAndIsAvailableTrue(restaurantId, categoryId)
				.stream()
				.map(this::convertToDto)
				.collect(Collectors.toList());
	}
	
	public List<MenuItemDto> searchMenuItems(Long restaurantId, String query) {
		return menuItemRepository.searchByRestaurantIdAndName(restaurantId, query)
				.stream()
				.map(this::convertToDto)
				.collect(Collectors.toList());
	}
	
	public List<MenuItemDto> getVegetarianMenuItems(Long restaurantId) {
		return menuItemRepository.findByRestaurantIdAndIsVegetarianTrueAndIsAvailableTrue(restaurantId)
				.stream()
				.map(this::convertToDto)
				.collect(Collectors.toList());
	}
	
	public List<MenuItemDto> getSpicyMenuItems(Long restaurantId) {
		return menuItemRepository.findByRestaurantIdAndIsSpicyTrueAndIsAvailableTrue(restaurantId)
				.stream()
				.map(this::convertToDto)
				.collect(Collectors.toList());
	}
	
	public List<MenuItemDto> getMenuItemsByPriceRange(Long restaurantId, double minPrice, double maxPrice) {
		return menuItemRepository.findByRestaurantIdAndPriceRange(restaurantId, minPrice, maxPrice)
				.stream()
				.map(this::convertToDto)
				.collect(Collectors.toList());
	}
	
	public MenuItemDto getMenuItemById(Long id) {
		MenuItem menuItem = menuItemRepository.findById(id)
				.orElseThrow(() -> new NotFoundException("Menu item not found"));
		return convertToDto(menuItem);
	}
	
	public MenuItemDto createMenuItem(MenuItemRequest request) {
		Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
				.orElseThrow(() -> new NotFoundException("Restaurant not found"));
		Category category = categoryRepository.findById(request.getCategoryId())
				.orElseThrow(() -> new NotFoundException("Category not found"));
		
		MenuItem menuItem = new MenuItem();
		applyRequest(menuItem, request, restaurant, category);
		MenuItem saved = menuItemRepository.save(menuItem);
		return convertToDto(saved);
	}
	
	public MenuItemDto updateMenuItem(Long id, MenuItemRequest request) {
		MenuItem menuItem = menuItemRepository.findById(id)
				.orElseThrow(() -> new NotFoundException("Menu item not found"));
		Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
				.orElseThrow(() -> new NotFoundException("Restaurant not found"));
		Category category = categoryRepository.findById(request.getCategoryId())
				.orElseThrow(() -> new NotFoundException("Category not found"));
		
		applyRequest(menuItem, request, restaurant, category);
		MenuItem saved = menuItemRepository.save(menuItem);
		return convertToDto(saved);
	}
	
	public void deleteMenuItem(Long id) {
		MenuItem menuItem = menuItemRepository.findById(id)
				.orElseThrow(() -> new NotFoundException("Menu item not found"));
		menuItemRepository.delete(menuItem);
	}
	
	private void applyRequest(MenuItem menuItem, MenuItemRequest request, Restaurant restaurant, Category category) {
		menuItem.setName(request.getName());
		menuItem.setDescription(request.getDescription());
		menuItem.setPrice(request.getPrice());
		menuItem.setImageUrl(request.getImageUrl());
		menuItem.setVegetarian(request.isVegetarian());
		menuItem.setSpicy(request.isSpicy());
		menuItem.setAvailable(request.isAvailable());
		menuItem.setPreparationTime(request.getPreparationTime());
		menuItem.setRestaurant(restaurant);
		menuItem.setCategory(category);
	}
	
	private MenuItemDto convertToDto(MenuItem menuItem) {
		MenuItemDto dto = new MenuItemDto();
		dto.setId(menuItem.getId());
		dto.setName(menuItem.getName());
		dto.setDescription(menuItem.getDescription());
		dto.setPrice(menuItem.getPrice());
		dto.setImageUrl(menuItem.getImageUrl());
		dto.setVegetarian(menuItem.isVegetarian());
		dto.setSpicy(menuItem.isSpicy());
		dto.setAvailable(menuItem.isAvailable());
		dto.setPreparationTime(menuItem.getPreparationTime());
		dto.setCreatedAt(menuItem.getCreatedAt());
		dto.setUpdatedAt(menuItem.getUpdatedAt());
		
		if (menuItem.getRestaurant() != null) {
			dto.setRestaurantId(menuItem.getRestaurant().getId());
			dto.setRestaurantName(menuItem.getRestaurant().getName());
		}
		
		if (menuItem.getCategory() != null) {
			dto.setCategoryId(menuItem.getCategory().getId());
			dto.setCategoryName(menuItem.getCategory().getName());
		}
		
		return dto;
	}
}