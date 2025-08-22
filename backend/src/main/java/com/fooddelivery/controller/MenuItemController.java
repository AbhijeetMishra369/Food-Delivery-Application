package com.fooddelivery.controller;

import com.fooddelivery.dto.MenuItemDto;
import com.fooddelivery.dto.MenuItemRequest;
import com.fooddelivery.service.MenuItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
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
	public ResponseEntity<List<MenuItemDto>> getMenuItemsByRestaurantAndCategory(
			@PathVariable Long restaurantId, 
			@PathVariable Long categoryId) {
		List<MenuItemDto> menuItems = menuItemService.getMenuItemsByRestaurantAndCategory(restaurantId, categoryId);
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
	public ResponseEntity<List<MenuItemDto>> getVegetarianMenuItems(@PathVariable Long restaurantId) {
		List<MenuItemDto> menuItems = menuItemService.getVegetarianMenuItems(restaurantId);
		return ResponseEntity.ok(menuItems);
	}
	
	@GetMapping("/restaurant/{restaurantId}/spicy")
	public ResponseEntity<List<MenuItemDto>> getSpicyMenuItems(@PathVariable Long restaurantId) {
		List<MenuItemDto> menuItems = menuItemService.getSpicyMenuItems(restaurantId);
		return ResponseEntity.ok(menuItems);
	}
	
	@GetMapping("/restaurant/{restaurantId}/price-range")
	public ResponseEntity<List<MenuItemDto>> getMenuItemsByPriceRange(
			@PathVariable Long restaurantId,
			@RequestParam double minPrice,
			@RequestParam double maxPrice) {
		List<MenuItemDto> menuItems = menuItemService.getMenuItemsByPriceRange(restaurantId, minPrice, maxPrice);
		return ResponseEntity.ok(menuItems);
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<MenuItemDto> getMenuItemById(@PathVariable Long id) {
		MenuItemDto menuItem = menuItemService.getMenuItemById(id);
		return ResponseEntity.ok(menuItem);
	}
	
	// Admin-only CRUD endpoints
	@PostMapping
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<MenuItemDto> createMenuItem(@Valid @RequestBody MenuItemRequest request) {
		MenuItemDto created = menuItemService.createMenuItem(request);
		return ResponseEntity.ok(created);
	}
	
	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<MenuItemDto> updateMenuItem(@PathVariable Long id, @Valid @RequestBody MenuItemRequest request) {
		MenuItemDto updated = menuItemService.updateMenuItem(id, request);
		return ResponseEntity.ok(updated);
	}
	
	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<Void> deleteMenuItem(@PathVariable Long id) {
		menuItemService.deleteMenuItem(id);
		return ResponseEntity.noContent().build();
	}
}