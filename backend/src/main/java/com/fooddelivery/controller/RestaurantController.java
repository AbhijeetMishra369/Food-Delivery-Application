package com.fooddelivery.controller;

import com.fooddelivery.dto.RestaurantDto;
import com.fooddelivery.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/restaurants")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RestaurantController {
    
    private final RestaurantService restaurantService;
    
    @GetMapping
    public ResponseEntity<List<RestaurantDto>> getAllRestaurants(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        if (page == 0 && size == 10) {
            return ResponseEntity.ok(restaurantService.getAllRestaurants());
        } else {
            Pageable pageable = PageRequest.of(page, size);
            Page<RestaurantDto> restaurants = restaurantService.getRestaurants(pageable);
            return ResponseEntity.ok(restaurants.getContent());
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<RestaurantDto> getRestaurantById(@PathVariable Long id) {
        RestaurantDto restaurant = restaurantService.getRestaurantById(id);
        return ResponseEntity.ok(restaurant);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<RestaurantDto>> searchRestaurants(@RequestParam String q) {
        List<RestaurantDto> restaurants = restaurantService.searchRestaurants(q);
        return ResponseEntity.ok(restaurants);
    }
    
    @GetMapping("/cuisine/{cuisine}")
    public ResponseEntity<List<RestaurantDto>> getRestaurantsByCuisine(@PathVariable String cuisine) {
        List<RestaurantDto> restaurants = restaurantService.getRestaurantsByCuisine(cuisine);
        return ResponseEntity.ok(restaurants);
    }
    
    @GetMapping("/rating/{minRating}")
    public ResponseEntity<List<RestaurantDto>> getRestaurantsByRating(@PathVariable Double minRating) {
        List<RestaurantDto> restaurants = restaurantService.getRestaurantsByRating(minRating);
        return ResponseEntity.ok(restaurants);
    }
    
    @GetMapping("/delivery-time/{maxDeliveryTime}")
    public ResponseEntity<List<RestaurantDto>> getRestaurantsByDeliveryTime(@PathVariable Integer maxDeliveryTime) {
        List<RestaurantDto> restaurants = restaurantService.getRestaurantsByDeliveryTime(maxDeliveryTime);
        return ResponseEntity.ok(restaurants);
    }
    
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<RestaurantDto>> getRestaurantsByOwner(@PathVariable Long ownerId) {
        List<RestaurantDto> restaurants = restaurantService.getRestaurantsByOwner(ownerId);
        return ResponseEntity.ok(restaurants);
    }
}