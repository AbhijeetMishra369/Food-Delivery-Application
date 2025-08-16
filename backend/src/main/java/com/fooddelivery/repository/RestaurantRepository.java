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
    
    List<Restaurant> findByIsActiveTrueAndIsOpenTrue();
    
    List<Restaurant> findByCuisine(String cuisine);
    
    @Query("SELECT r FROM Restaurant r WHERE " +
           "LOWER(r.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(r.cuisine) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Restaurant> searchByNameOrCuisine(@Param("query") String query);
    
    List<Restaurant> findByOwnerId(Long ownerId);
    
    Optional<Restaurant> findByIdAndIsActiveTrue(Long id);
    
    @Query("SELECT r FROM Restaurant r WHERE r.rating >= :minRating")
    List<Restaurant> findByMinimumRating(@Param("minRating") double minRating);
    
    @Query("SELECT r FROM Restaurant r WHERE r.deliveryTime <= :maxDeliveryTime")
    List<Restaurant> findByMaxDeliveryTime(@Param("maxDeliveryTime") int maxDeliveryTime);
}