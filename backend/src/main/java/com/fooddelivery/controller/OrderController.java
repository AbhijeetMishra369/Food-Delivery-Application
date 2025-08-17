package com.fooddelivery.controller;

import com.fooddelivery.dto.OrderDto;
import com.fooddelivery.dto.OrderRequest;
import com.fooddelivery.entity.Order;
import com.fooddelivery.entity.User;
import com.fooddelivery.repository.UserRepository;
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
    private final UserRepository userRepository;
    
    @PostMapping
    public ResponseEntity<OrderDto> createOrder(@Valid @RequestBody OrderRequest request, Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        OrderDto order = orderService.createOrder(request, userId);
        return ResponseEntity.ok(order);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> getOrderById(@PathVariable Long id) {
        OrderDto order = orderService.getOrderById(id);
        return ResponseEntity.ok(order);
    }
    
    @GetMapping("/user")
    public ResponseEntity<List<OrderDto>> getUserOrders(Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        List<OrderDto> orders = orderService.getUserOrders(userId);
        return ResponseEntity.ok(orders);
    }
    
    @GetMapping("/user/page")
    public ResponseEntity<Page<OrderDto>> getUserOrdersPaginated(Pageable pageable, Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
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
    
    private Long getCurrentUserId(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .map(User::getId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}