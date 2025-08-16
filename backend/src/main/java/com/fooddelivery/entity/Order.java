package com.fooddelivery.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "order_number", unique = true, nullable = false)
    private String orderNumber;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<OrderItem> orderItems;
    
    @Column(nullable = false)
    private double subtotal;
    
    @Column(name = "delivery_fee", nullable = false)
    private double deliveryFee;
    
    @Column(nullable = false)
    private double tax;
    
    @Column(nullable = false)
    private double total;
    
    @Column(name = "delivery_address", nullable = false)
    private String deliveryAddress;
    
    @Column(name = "delivery_phone", nullable = false)
    private String deliveryPhone;
    
    @Column(name = "delivery_instructions")
    private String deliveryInstructions;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.PENDING;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;
    
    @Column(name = "payment_method", nullable = false)
    private String paymentMethod;
    
    @Column(name = "payment_id")
    private String paymentId;
    
    @Column(name = "order_time")
    private LocalDateTime orderTime;
    
    @Column(name = "estimated_delivery_time")
    private LocalDateTime estimatedDeliveryTime;
    
    @Column(name = "actual_delivery_time")
    private LocalDateTime actualDeliveryTime;
    
    @Column(name = "delivery_person_name")
    private String deliveryPersonName;
    
    @Column(name = "delivery_person_phone")
    private String deliveryPersonPhone;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        orderTime = LocalDateTime.now();
        estimatedDeliveryTime = LocalDateTime.now().plusMinutes(30);
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum OrderStatus {
        PENDING, CONFIRMED, PREPARING, READY_FOR_DELIVERY, OUT_FOR_DELIVERY, DELIVERED, CANCELLED
    }
    
    public enum PaymentStatus {
        PENDING, COMPLETED, FAILED, REFUNDED
    }
}