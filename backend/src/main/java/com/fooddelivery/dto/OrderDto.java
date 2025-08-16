package com.fooddelivery.dto;

import com.fooddelivery.entity.Order;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {
    
    private Long id;
    private String orderNumber;
    private Long userId;
    private String userName;
    private Long restaurantId;
    private String restaurantName;
    private List<OrderItemDto> orderItems;
    private double subtotal;
    private double deliveryFee;
    private double tax;
    private double total;
    private String deliveryAddress;
    private String deliveryPhone;
    private String deliveryInstructions;
    private Order.OrderStatus status;
    private Order.PaymentStatus paymentStatus;
    private String paymentMethod;
    private String paymentId;
    private LocalDateTime orderTime;
    private LocalDateTime estimatedDeliveryTime;
    private LocalDateTime actualDeliveryTime;
    private String deliveryPersonName;
    private String deliveryPersonPhone;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemDto {
        private Long id;
        private Long menuItemId;
        private String menuItemName;
        private int quantity;
        private double unitPrice;
        private double totalPrice;
        private String specialInstructions;
    }
}