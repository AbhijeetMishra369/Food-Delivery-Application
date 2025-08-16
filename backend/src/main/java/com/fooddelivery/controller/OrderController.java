package com.fooddelivery.controller;

import com.fooddelivery.dto.OrderDto;
import com.fooddelivery.dto.OrderRequest;
import com.fooddelivery.entity.Order;
import com.fooddelivery.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {
    
    private final OrderService orderService;
    
    @PostMapping
    public ResponseEntity<OrderDto> createOrder(@Valid @RequestBody OrderRequest request) {
        Long userId = getCurrentUserId();
        OrderDto order = orderService.createOrder(request, userId);
        return ResponseEntity.ok(order);
    }
    
    @GetMapping("/user")
    public ResponseEntity<List<OrderDto>> getUserOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Long userId = getCurrentUserId();
        
        if (page == 0 && size == 10) {
            List<OrderDto> orders = orderService.getUserOrders(userId);
            return ResponseEntity.ok(orders);
        } else {
            Pageable pageable = PageRequest.of(page, size);
            Page<OrderDto> orders = orderService.getUserOrders(userId, pageable);
            return ResponseEntity.ok(orders.getContent());
        }
    }
    
    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<OrderDto>> getRestaurantOrders(
            @PathVariable Long restaurantId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        if (page == 0 && size == 10) {
            List<OrderDto> orders = orderService.getRestaurantOrders(restaurantId);
            return ResponseEntity.ok(orders);
        } else {
            Pageable pageable = PageRequest.of(page, size);
            Page<OrderDto> orders = orderService.getRestaurantOrders(restaurantId, pageable);
            return ResponseEntity.ok(orders.getContent());
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> getOrderById(@PathVariable Long id) {
        OrderDto order = orderService.getOrderById(id);
        return ResponseEntity.ok(order);
    }
    
    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<OrderDto> getOrderByOrderNumber(@PathVariable String orderNumber) {
        OrderDto order = orderService.getOrderByOrderNumber(orderNumber);
        return ResponseEntity.ok(order);
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<OrderDto> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam Order.OrderStatus status) {
        OrderDto order = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(order);
    }
    
    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // This is a simplified approach - in a real application, you'd extract user ID from JWT token
        // For now, we'll assume the principal name is the user ID
        return Long.parseLong(authentication.getName());
    }
}