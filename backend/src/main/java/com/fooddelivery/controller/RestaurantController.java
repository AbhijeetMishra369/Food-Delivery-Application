package com.fooddelivery.controller;

import com.fooddelivery.dto.RestaurantDto;
import com.fooddelivery.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
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
    public ResponseEntity<List<RestaurantDto>> getAllRestaurants() {
        List<RestaurantDto> restaurants = restaurantService.getAllRestaurants();
        return ResponseEntity.ok(restaurants);
    }
    
    @GetMapping("/page")
    public ResponseEntity<Page<RestaurantDto>> getAllRestaurantsPaginated(Pageable pageable) {
        Page<RestaurantDto> restaurants = restaurantService.getAllRestaurants(pageable);
        return ResponseEntity.ok(restaurants);
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
    public ResponseEntity<List<RestaurantDto>> getRestaurantsByRating(@PathVariable double minRating) {
        List<RestaurantDto> restaurants = restaurantService.getRestaurantsByRating(minRating);
        return ResponseEntity.ok(restaurants);
    }
    
    @GetMapping("/delivery-time/{maxTime}")
    public ResponseEntity<List<RestaurantDto>> getRestaurantsByDeliveryTime(@PathVariable int maxTime) {
        List<RestaurantDto> restaurants = restaurantService.getRestaurantsByDeliveryTime(maxTime);
        return ResponseEntity.ok(restaurants);
    }
}