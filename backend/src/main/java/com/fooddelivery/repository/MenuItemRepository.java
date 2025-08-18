package com.fooddelivery.repository;

import com.fooddelivery.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    
    @Query("SELECT mi FROM MenuItem mi JOIN FETCH mi.restaurant r JOIN FETCH mi.category c WHERE r.id = :restaurantId AND mi.isAvailable = true")
    List<MenuItem> findByRestaurantIdAndIsAvailableTrue(@Param("restaurantId") Long restaurantId);
    
    @Query("SELECT mi FROM MenuItem mi JOIN FETCH mi.restaurant r JOIN FETCH mi.category c WHERE r.id = :restaurantId AND c.id = :categoryId AND mi.isAvailable = true")
    List<MenuItem> findByRestaurantIdAndCategoryIdAndIsAvailableTrue(@Param("restaurantId") Long restaurantId, @Param("categoryId") Long categoryId);
    
    @Query("SELECT mi FROM MenuItem mi JOIN FETCH mi.restaurant r JOIN FETCH mi.category c WHERE r.id = :restaurantId AND " +
           "LOWER(mi.name) LIKE LOWER(CONCAT('%', :query, '%')) AND mi.isAvailable = true")
    List<MenuItem> searchByRestaurantIdAndName(@Param("restaurantId") Long restaurantId, 
                                              @Param("query") String query);
    
    @Query("SELECT mi FROM MenuItem mi JOIN FETCH mi.restaurant r JOIN FETCH mi.category c WHERE r.id = :restaurantId AND mi.isVegetarian = true AND mi.isAvailable = true")
    List<MenuItem> findByRestaurantIdAndIsVegetarianTrueAndIsAvailableTrue(@Param("restaurantId") Long restaurantId);
    
    @Query("SELECT mi FROM MenuItem mi JOIN FETCH mi.restaurant r JOIN FETCH mi.category c WHERE r.id = :restaurantId AND mi.isSpicy = true AND mi.isAvailable = true")
    List<MenuItem> findByRestaurantIdAndIsSpicyTrueAndIsAvailableTrue(@Param("restaurantId") Long restaurantId);
    
    @Query("SELECT mi FROM MenuItem mi JOIN FETCH mi.restaurant r JOIN FETCH mi.category c WHERE r.id = :restaurantId AND " +
           "mi.price BETWEEN :minPrice AND :maxPrice AND mi.isAvailable = true")
    List<MenuItem> findByRestaurantIdAndPriceRange(@Param("restaurantId") Long restaurantId,
                                                  @Param("minPrice") double minPrice,
                                                  @Param("maxPrice") double maxPrice);
    
    @Query("SELECT mi FROM MenuItem mi JOIN FETCH mi.restaurant r JOIN FETCH mi.category c WHERE r.id = :restaurantId AND mi.isAvailable = true ORDER BY mi.name ASC")
    List<MenuItem> findByRestaurantIdAndIsAvailableTrueOrderByNameAsc(@Param("restaurantId") Long restaurantId);
    
    @Query("SELECT mi FROM MenuItem mi JOIN FETCH mi.restaurant r JOIN FETCH mi.category c WHERE r.id = :restaurantId AND " +
           "c.id = :categoryId AND mi.isAvailable = true ORDER BY mi.name")
    List<MenuItem> findByRestaurantIdAndCategoryIdOrderByName(@Param("restaurantId") Long restaurantId,
                                                             @Param("categoryId") Long categoryId);
}