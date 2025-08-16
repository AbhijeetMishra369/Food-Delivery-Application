package com.fooddelivery.controller;

import com.fooddelivery.dto.MenuItemDto;
import com.fooddelivery.service.MenuItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/menu-items")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MenuItemController {
    
    private final MenuItemService menuItemService;
    
    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<MenuItemDto>> getMenuItemsByRestaurant(@PathVariable Long restaurantId) {
        List<MenuItemDto> menuItems = menuItemService.getMenuItemsByRestaurant(restaurantId);
        return ResponseEntity.ok(menuItems);
    }
    
    @GetMapping("/restaurant/{restaurantId}/category/{categoryId}")
    public ResponseEntity<List<MenuItemDto>> getMenuItemsByCategory(
            @PathVariable Long restaurantId,
            @PathVariable Long categoryId) {
        List<MenuItemDto> menuItems = menuItemService.getMenuItemsByCategory(restaurantId, categoryId);
        return ResponseEntity.ok(menuItems);
    }
    
    @GetMapping("/restaurant/{restaurantId}/search")
    public ResponseEntity<List<MenuItemDto>> searchMenuItems(
            @PathVariable Long restaurantId,
            @RequestParam String q) {
        List<MenuItemDto> menuItems = menuItemService.searchMenuItems(restaurantId, q);
        return ResponseEntity.ok(menuItems);
    }
    
    @GetMapping("/restaurant/{restaurantId}/vegetarian")
    public ResponseEntity<List<MenuItemDto>> getVegetarianItems(@PathVariable Long restaurantId) {
        List<MenuItemDto> menuItems = menuItemService.getVegetarianItems(restaurantId);
        return ResponseEntity.ok(menuItems);
    }
    
    @GetMapping("/restaurant/{restaurantId}/spicy")
    public ResponseEntity<List<MenuItemDto>> getSpicyItems(@PathVariable Long restaurantId) {
        List<MenuItemDto> menuItems = menuItemService.getSpicyItems(restaurantId);
        return ResponseEntity.ok(menuItems);
    }
    
    @GetMapping("/restaurant/{restaurantId}/price-range")
    public ResponseEntity<List<MenuItemDto>> getItemsByPriceRange(
            @PathVariable Long restaurantId,
            @RequestParam Double minPrice,
            @RequestParam Double maxPrice) {
        List<MenuItemDto> menuItems = menuItemService.getItemsByPriceRange(restaurantId, minPrice, maxPrice);
        return ResponseEntity.ok(menuItems);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<MenuItemDto> getMenuItemById(@PathVariable Long id) {
        MenuItemDto menuItem = menuItemService.getMenuItemById(id);
        return ResponseEntity.ok(menuItem);
    }
}