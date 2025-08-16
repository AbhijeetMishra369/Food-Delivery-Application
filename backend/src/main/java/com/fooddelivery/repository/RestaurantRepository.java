package com.fooddelivery.repository;

import com.fooddelivery.entity.Restaurant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    
    Page<Restaurant> findByIsActiveTrueAndIsOpenTrue(Pageable pageable);
    
    List<Restaurant> findByCuisineContainingIgnoreCaseAndIsActiveTrueAndIsOpenTrue(String cuisine);
    
    @Query("SELECT r FROM Restaurant r WHERE r.name LIKE %:searchTerm% OR r.cuisine LIKE %:searchTerm% AND r.isActive = true AND r.isOpen = true")
    List<Restaurant> searchRestaurants(@Param("searchTerm") String searchTerm);
    
    List<Restaurant> findByOwnerIdAndIsActiveTrue(Long ownerId);
    
    Optional<Restaurant> findByIdAndIsActiveTrue(Long id);
    
    @Query("SELECT r FROM Restaurant r WHERE r.rating >= :minRating AND r.isActive = true AND r.isOpen = true ORDER BY r.rating DESC")
    List<Restaurant> findByRatingGreaterThanEqual(@Param("minRating") Double minRating);
    
    @Query("SELECT r FROM Restaurant r WHERE r.deliveryTime <= :maxDeliveryTime AND r.isActive = true AND r.isOpen = true ORDER BY r.deliveryTime ASC")
    List<Restaurant> findByDeliveryTimeLessThanEqual(@Param("maxDeliveryTime") Integer maxDeliveryTime);
}