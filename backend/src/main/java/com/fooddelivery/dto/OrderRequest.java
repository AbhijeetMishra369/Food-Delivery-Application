package com.fooddelivery.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {
    
    @NotNull(message = "Restaurant ID is required")
    private Long restaurantId;
    
    @NotEmpty(message = "Order items cannot be empty")
    @Valid
    private List<OrderItemRequest> items;
    
    @NotBlank(message = "Delivery address is required")
    @Size(min = 10, max = 200, message = "Delivery address must be between 10 and 200 characters")
    private String deliveryAddress;
    
    @NotBlank(message = "Delivery phone is required")
    @Size(min = 10, max = 15, message = "Delivery phone must be between 10 and 15 characters")
    private String deliveryPhone;
    
    @Size(max = 500, message = "Delivery instructions cannot exceed 500 characters")
    private String deliveryInstructions;
    
    @NotBlank(message = "Payment method is required")
    private String paymentMethod;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemRequest {
        
        @NotNull(message = "Menu item ID is required")
        private Long menuItemId;
        
        @NotNull(message = "Quantity is required")
        private Integer quantity;
        
        @Size(max = 200, message = "Special instructions cannot exceed 200 characters")
        private String specialInstructions;
    }
}