package com.fooddelivery.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private Order order;
    
    @Column(name = "razorpay_order_id", unique = true, nullable = false)
    private String razorpayOrderId;
    
    @Column(name = "razorpay_payment_id", unique = true, nullable = false)
    private String razorpayPaymentId;
    
    @Column(nullable = false)
    private double amount;
    
    @Column(nullable = false)
    private String currency = "INR";
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status = PaymentStatus.PENDING;
    
    @Column(name = "payment_method", nullable = false)
    private String paymentMethod;
    
    @Column
    private String description;
    
    @Column(name = "error_code")
    private String errorCode;
    
    @Column(name = "error_description")
    private String errorDescription;
    
    @Column(name = "payment_time")
    private LocalDateTime paymentTime;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum PaymentStatus {
        PENDING, COMPLETED, FAILED, REFUNDED, CANCELLED
    }
}