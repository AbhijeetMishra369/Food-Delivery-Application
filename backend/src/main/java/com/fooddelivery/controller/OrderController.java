package com.fooddelivery.controller;

import com.fooddelivery.dto.OrderDto;
import com.fooddelivery.dto.OrderRequest;
import com.fooddelivery.entity.Order;
import com.fooddelivery.entity.User;
import com.fooddelivery.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<OrderDto> createOrder(@Valid @RequestBody OrderRequest request, @AuthenticationPrincipal User user) {
		Long userId = user.getId();
		OrderDto order = orderService.createOrder(request, userId);
		return ResponseEntity.ok(order);
	}
	
	@GetMapping("/{id}")
	@PreAuthorize("hasAnyRole('USER','ADMIN')")
	public ResponseEntity<OrderDto> getOrderById(@PathVariable Long id) {
		OrderDto order = orderService.getOrderById(id);
		return ResponseEntity.ok(order);
	}
	
	@GetMapping("/user")
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<List<OrderDto>> getUserOrders(@AuthenticationPrincipal User user) {
		Long userId = user.getId();
		List<OrderDto> orders = orderService.getUserOrders(userId);
		return ResponseEntity.ok(orders);
	}
	
	@GetMapping("/user/page")
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<Page<OrderDto>> getUserOrdersPaginated(Pageable pageable, @AuthenticationPrincipal User user) {
		Long userId = user.getId();
		Page<OrderDto> orders = orderService.getUserOrders(userId, pageable);
		return ResponseEntity.ok(orders);
	}
	
	@GetMapping("/restaurant/{restaurantId}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<List<OrderDto>> getRestaurantOrders(@PathVariable Long restaurantId) {
		List<OrderDto> orders = orderService.getRestaurantOrders(restaurantId);
		return ResponseEntity.ok(orders);
	}
	
	@PutMapping("/{id}/status")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<OrderDto> updateOrderStatus(
			@PathVariable Long id, 
			@RequestParam Order.OrderStatus status) {
		OrderDto order = orderService.updateOrderStatus(id, status);
		return ResponseEntity.ok(order);
	}
	
	@PutMapping("/{id}/payment-status")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<OrderDto> updateOrderPaymentStatus(
			@PathVariable Long id, 
			@RequestParam Order.PaymentStatus paymentStatus) {
		OrderDto order = orderService.updateOrderPaymentStatus(id, paymentStatus);
		return ResponseEntity.ok(order);
	}
}