package com.fooddelivery.controller;

import com.fooddelivery.dto.OrderDto;
import com.fooddelivery.dto.OrderRequest;
import com.fooddelivery.entity.Order;
import com.fooddelivery.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {
    
    private final OrderService orderService;
    
    @PostMapping
    public ResponseEntity<OrderDto> createOrder(@Valid @RequestBody OrderRequest request, Authentication authentication) {
        // In a real application, you would get the user ID from the authentication
        // For now, we'll use a default user ID
        Long userId = 1L; // This should come from the authenticated user
        OrderDto order = orderService.createOrder(request, userId);
        return ResponseEntity.ok(order);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> getOrderById(@PathVariable Long id) {
        OrderDto order = orderService.getOrderById(id);
        return ResponseEntity.ok(order);
    }
    
    @GetMapping("/user")
    public ResponseEntity<List<OrderDto>> getUserOrders() {
        // In a real application, you would get the user ID from the authentication
        Long userId = 1L; // This should come from the authenticated user
        List<OrderDto> orders = orderService.getUserOrders(userId);
        return ResponseEntity.ok(orders);
    }
    
    @GetMapping("/user/page")
    public ResponseEntity<Page<OrderDto>> getUserOrdersPaginated(Pageable pageable) {
        // In a real application, you would get the user ID from the authentication
        Long userId = 1L; // This should come from the authenticated user
        Page<OrderDto> orders = orderService.getUserOrders(userId, pageable);
        return ResponseEntity.ok(orders);
    }
    
    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<OrderDto>> getRestaurantOrders(@PathVariable Long restaurantId) {
        List<OrderDto> orders = orderService.getRestaurantOrders(restaurantId);
        return ResponseEntity.ok(orders);
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<OrderDto> updateOrderStatus(
            @PathVariable Long id, 
            @RequestParam Order.OrderStatus status) {
        OrderDto order = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(order);
    }
    
    @PutMapping("/{id}/payment-status")
    public ResponseEntity<OrderDto> updateOrderPaymentStatus(
            @PathVariable Long id, 
            @RequestParam Order.PaymentStatus paymentStatus) {
        OrderDto order = orderService.updateOrderPaymentStatus(id, paymentStatus);
        return ResponseEntity.ok(order);
    }
}