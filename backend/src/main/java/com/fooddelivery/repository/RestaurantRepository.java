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
    
    @Query("SELECT DISTINCT r FROM Restaurant r LEFT JOIN FETCH r.owner WHERE r.isActive = true AND r.isOpen = true")
    List<Restaurant> findByIsActiveTrueAndIsOpenTrue();
    
    @Query("SELECT DISTINCT r FROM Restaurant r LEFT JOIN FETCH r.owner WHERE r.cuisine = :cuisine")
    List<Restaurant> findByCuisine(@Param("cuisine") String cuisine);
    
    @Query("SELECT DISTINCT r FROM Restaurant r LEFT JOIN FETCH r.owner WHERE " +
           "LOWER(r.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(r.cuisine) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Restaurant> searchByNameOrCuisine(@Param("query") String query);
    
    @Query("SELECT DISTINCT r FROM Restaurant r LEFT JOIN FETCH r.owner WHERE r.owner.id = :ownerId")
    List<Restaurant> findByOwnerId(@Param("ownerId") Long ownerId);
    
    @Query("SELECT DISTINCT r FROM Restaurant r LEFT JOIN FETCH r.owner WHERE r.id = :id AND r.isActive = true")
    Optional<Restaurant> findByIdAndIsActiveTrue(@Param("id") Long id);
    
    @Query("SELECT DISTINCT r FROM Restaurant r LEFT JOIN FETCH r.owner WHERE r.rating >= :minRating")
    List<Restaurant> findByMinimumRating(@Param("minRating") double minRating);
    
    @Query("SELECT DISTINCT r FROM Restaurant r LEFT JOIN FETCH r.owner WHERE r.deliveryTime <= :maxDeliveryTime")
    List<Restaurant> findByMaxDeliveryTime(@Param("maxDeliveryTime") int maxDeliveryTime);
}