package com.fooddelivery.repository;

import com.fooddelivery.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    
    List<MenuItem> findByRestaurantIdAndIsAvailableTrue(Long restaurantId);
    
    List<MenuItem> findByRestaurantIdAndCategoryIdAndIsAvailableTrue(Long restaurantId, Long categoryId);
    
    @Query("SELECT mi FROM MenuItem mi WHERE mi.restaurant.id = :restaurantId AND " +
           "LOWER(mi.name) LIKE LOWER(CONCAT('%', :query, '%')) AND mi.isAvailable = true")
    List<MenuItem> searchByRestaurantIdAndName(@Param("restaurantId") Long restaurantId, 
                                              @Param("query") String query);
    
    List<MenuItem> findByRestaurantIdAndIsVegetarianTrueAndIsAvailableTrue(Long restaurantId);
    
    List<MenuItem> findByRestaurantIdAndIsSpicyTrueAndIsAvailableTrue(Long restaurantId);
    
    @Query("SELECT mi FROM MenuItem mi WHERE mi.restaurant.id = :restaurantId AND " +
           "mi.price BETWEEN :minPrice AND :maxPrice AND mi.isAvailable = true")
    List<MenuItem> findByRestaurantIdAndPriceRange(@Param("restaurantId") Long restaurantId,
                                                  @Param("minPrice") double minPrice,
                                                  @Param("maxPrice") double maxPrice);
    
    List<MenuItem> findByRestaurantIdAndIsAvailableTrueOrderByNameAsc(Long restaurantId);
    
    @Query("SELECT mi FROM MenuItem mi WHERE mi.restaurant.id = :restaurantId AND " +
           "mi.category.id = :categoryId AND mi.isAvailable = true ORDER BY mi.name")
    List<MenuItem> findByRestaurantIdAndCategoryIdOrderByName(@Param("restaurantId") Long restaurantId,
                                                             @Param("categoryId") Long categoryId);
}