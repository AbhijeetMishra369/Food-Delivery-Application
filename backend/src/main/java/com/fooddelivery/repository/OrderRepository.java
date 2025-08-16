package com.fooddelivery.repository;

import com.fooddelivery.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    Page<Order> findByUserId(Long userId, Pageable pageable);
    
    List<Order> findByRestaurantIdOrderByCreatedAtDesc(Long restaurantId);
    
    Page<Order> findByRestaurantId(Long restaurantId, Pageable pageable);
    
    Optional<Order> findByOrderNumber(String orderNumber);
    
    @Query("SELECT o FROM Order o WHERE o.status = :status AND o.restaurant.id = :restaurantId ORDER BY o.createdAt ASC")
    List<Order> findByStatusAndRestaurantId(@Param("status") Order.OrderStatus status, @Param("restaurantId") Long restaurantId);
    
    @Query("SELECT o FROM Order o WHERE o.status = :status AND o.user.id = :userId ORDER BY o.createdAt DESC")
    List<Order> findByStatusAndUserId(@Param("status") Order.OrderStatus status, @Param("userId") Long userId);
    
    @Query("SELECT o FROM Order o WHERE o.createdAt BETWEEN :startDate AND :endDate AND o.restaurant.id = :restaurantId")
    List<Order> findByDateRangeAndRestaurantId(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate, @Param("restaurantId") Long restaurantId);
    
    @Query("SELECT o FROM Order o WHERE o.paymentStatus = :paymentStatus ORDER BY o.createdAt DESC")
    List<Order> findByPaymentStatus(@Param("paymentStatus") Order.PaymentStatus paymentStatus);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = :status AND o.restaurant.id = :restaurantId")
    Long countByStatusAndRestaurantId(@Param("status") Order.OrderStatus status, @Param("restaurantId") Long restaurantId);
    
    @Query("SELECT o FROM Order o WHERE o.deliveryPersonPhone = :phone AND o.status IN ('OUT_FOR_DELIVERY', 'READY_FOR_DELIVERY') ORDER BY o.createdAt ASC")
    List<Order> findActiveDeliveriesByDeliveryPerson(@Param("phone") String phone);
}