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
    
    Page<Order> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    Page<Order> findByRestaurantIdOrderByCreatedAtDesc(Long restaurantId, Pageable pageable);
    
    List<Order> findByRestaurantIdOrderByCreatedAtDesc(Long restaurantId);
    
    Optional<Order> findByOrderNumber(String orderNumber);
    
    @Query("SELECT o FROM Order o WHERE o.status = :status AND o.restaurant.id = :restaurantId")
    List<Order> findByStatusAndRestaurantId(@Param("status") Order.OrderStatus status, 
                                          @Param("restaurantId") Long restaurantId);
    
    @Query("SELECT o FROM Order o WHERE o.status = :status AND o.user.id = :userId")
    List<Order> findByStatusAndUserId(@Param("status") Order.OrderStatus status, 
                                    @Param("userId") Long userId);
    
    @Query("SELECT o FROM Order o WHERE o.createdAt BETWEEN :startDate AND :endDate AND o.restaurant.id = :restaurantId")
    List<Order> findByDateRangeAndRestaurantId(@Param("startDate") LocalDateTime startDate,
                                             @Param("endDate") LocalDateTime endDate,
                                             @Param("restaurantId") Long restaurantId);
    
    @Query("SELECT o FROM Order o WHERE o.paymentStatus = :paymentStatus")
    List<Order> findByPaymentStatus(@Param("paymentStatus") Order.PaymentStatus paymentStatus);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = :status AND o.restaurant.id = :restaurantId")
    long countByStatusAndRestaurantId(@Param("status") Order.OrderStatus status, 
                                    @Param("restaurantId") Long restaurantId);
    
    @Query("SELECT o FROM Order o WHERE o.status IN ('OUT_FOR_DELIVERY', 'READY_FOR_DELIVERY') AND o.deliveryPersonPhone = :phone")
    List<Order> findActiveDeliveriesByDeliveryPersonPhone(@Param("phone") String phone);
}