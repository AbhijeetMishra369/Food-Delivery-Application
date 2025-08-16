package com.fooddelivery.repository;

import com.fooddelivery.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    
    List<MenuItem> findByRestaurantIdAndIsAvailableTrue(Long restaurantId);
    
    List<MenuItem> findByRestaurantIdAndCategoryIdAndIsAvailableTrue(Long restaurantId, Long categoryId);
    
    @Query("SELECT mi FROM MenuItem mi WHERE mi.restaurant.id = :restaurantId AND mi.name LIKE %:searchTerm% AND mi.isAvailable = true")
    List<MenuItem> searchMenuItems(@Param("restaurantId") Long restaurantId, @Param("searchTerm") String searchTerm);
    
    List<MenuItem> findByRestaurantIdAndIsVegetarianTrueAndIsAvailableTrue(Long restaurantId);
    
    List<MenuItem> findByRestaurantIdAndIsSpicyTrueAndIsAvailableTrue(Long restaurantId);
    
    @Query("SELECT mi FROM MenuItem mi WHERE mi.restaurant.id = :restaurantId AND mi.price BETWEEN :minPrice AND :maxPrice AND mi.isAvailable = true")
    List<MenuItem> findByPriceRange(@Param("restaurantId") Long restaurantId, @Param("minPrice") Double minPrice, @Param("maxPrice") Double maxPrice);
    
    Optional<MenuItem> findByIdAndIsAvailableTrue(Long id);
    
    @Query("SELECT mi FROM MenuItem mi WHERE mi.restaurant.id = :restaurantId AND mi.category.id = :categoryId AND mi.isAvailable = true ORDER BY mi.name ASC")
    List<MenuItem> findByRestaurantAndCategoryOrderByName(@Param("restaurantId") Long restaurantId, @Param("categoryId") Long categoryId);
}