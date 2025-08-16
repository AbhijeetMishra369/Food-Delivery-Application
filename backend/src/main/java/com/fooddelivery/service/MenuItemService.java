package com.fooddelivery.service;

import com.fooddelivery.dto.MenuItemDto;
import com.fooddelivery.entity.MenuItem;
import com.fooddelivery.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MenuItemService {
    
    private final MenuItemRepository menuItemRepository;
    
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
                .orElseThrow(() -> new RuntimeException("Menu item not found"));
        return convertToDto(menuItem);
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