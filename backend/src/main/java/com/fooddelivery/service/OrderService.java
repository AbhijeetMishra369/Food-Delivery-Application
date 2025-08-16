package com.fooddelivery.service;

import com.fooddelivery.dto.OrderDto;
import com.fooddelivery.dto.OrderRequest;
import com.fooddelivery.entity.*;
import com.fooddelivery.repository.MenuItemRepository;
import com.fooddelivery.repository.OrderRepository;
import com.fooddelivery.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;
    
    @Transactional
    public OrderDto createOrder(OrderRequest request, Long userId) {
        // Get restaurant
        Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
        
        // Create order
        Order order = new Order();
        order.setOrderNumber("ORD" + System.currentTimeMillis());
        order.setRestaurant(restaurant);
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setDeliveryPhone(request.getDeliveryPhone());
        order.setDeliveryInstructions(request.getDeliveryInstructions());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setStatus(Order.OrderStatus.PENDING);
        order.setPaymentStatus(Order.PaymentStatus.PENDING);
        
        // Calculate totals
        double subtotal = 0.0;
        double deliveryFee = restaurant.getDeliveryFee();
        double tax = 0.0; // 10% tax
        double total = 0.0;
        
        // Create order items
        List<OrderItem> orderItems = request.getItems().stream()
                .map(itemRequest -> {
                    MenuItem menuItem = menuItemRepository.findById(itemRequest.getMenuItemId())
                            .orElseThrow(() -> new RuntimeException("Menu item not found"));
                    
                    OrderItem orderItem = new OrderItem();
                    orderItem.setOrder(order);
                    orderItem.setMenuItem(menuItem);
                    orderItem.setQuantity(itemRequest.getQuantity());
                    orderItem.setUnitPrice(menuItem.getPrice());
                    orderItem.setTotalPrice(menuItem.getPrice() * itemRequest.getQuantity());
                    orderItem.setSpecialInstructions(itemRequest.getSpecialInstructions());
                    
                    subtotal += orderItem.getTotalPrice();
                    return orderItem;
                })
                .collect(Collectors.toList());
        
        tax = subtotal * 0.10; // 10% tax
        total = subtotal + deliveryFee + tax;
        
        order.setSubtotal(subtotal);
        order.setDeliveryFee(deliveryFee);
        order.setTax(tax);
        order.setTotal(total);
        order.setOrderItems(orderItems);
        
        Order savedOrder = orderRepository.save(order);
        
        return convertToDto(savedOrder);
    }
    
    public OrderDto getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return convertToDto(order);
    }
    
    public List<OrderDto> getUserOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public Page<OrderDto> getUserOrders(Long userId, Pageable pageable) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(this::convertToDto);
    }
    
    public List<OrderDto> getRestaurantOrders(Long restaurantId) {
        return orderRepository.findByRestaurantIdOrderByCreatedAtDesc(restaurantId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public OrderDto updateOrderStatus(Long orderId, Order.OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        order.setStatus(status);
        
        if (status == Order.OrderStatus.DELIVERED) {
            order.setActualDeliveryTime(LocalDateTime.now());
        }
        
        Order savedOrder = orderRepository.save(order);
        return convertToDto(savedOrder);
    }
    
    @Transactional
    public OrderDto updateOrderPaymentStatus(Long orderId, Order.PaymentStatus paymentStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        order.setPaymentStatus(paymentStatus);
        Order savedOrder = orderRepository.save(order);
        return convertToDto(savedOrder);
    }
    
    private OrderDto convertToDto(Order order) {
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setSubtotal(order.getSubtotal());
        dto.setDeliveryFee(order.getDeliveryFee());
        dto.setTax(order.getTax());
        dto.setTotal(order.getTotal());
        dto.setDeliveryAddress(order.getDeliveryAddress());
        dto.setDeliveryPhone(order.getDeliveryPhone());
        dto.setDeliveryInstructions(order.getDeliveryInstructions());
        dto.setStatus(order.getStatus());
        dto.setPaymentStatus(order.getPaymentStatus());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setPaymentId(order.getPaymentId());
        dto.setOrderTime(order.getOrderTime());
        dto.setEstimatedDeliveryTime(order.getEstimatedDeliveryTime());
        dto.setActualDeliveryTime(order.getActualDeliveryTime());
        dto.setDeliveryPersonName(order.getDeliveryPersonName());
        dto.setDeliveryPersonPhone(order.getDeliveryPersonPhone());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());
        
        if (order.getUser() != null) {
            dto.setUserId(order.getUser().getId());
            dto.setUserName(order.getUser().getFirstName() + " " + order.getUser().getLastName());
        }
        
        if (order.getRestaurant() != null) {
            dto.setRestaurantId(order.getRestaurant().getId());
            dto.setRestaurantName(order.getRestaurant().getName());
        }
        
        if (order.getOrderItems() != null) {
            dto.setOrderItems(order.getOrderItems().stream()
                    .map(this::convertToOrderItemDto)
                    .collect(Collectors.toList()));
        }
        
        return dto;
    }
    
    private OrderDto.OrderItemDto convertToOrderItemDto(OrderItem orderItem) {
        OrderDto.OrderItemDto dto = new OrderDto.OrderItemDto();
        dto.setId(orderItem.getId());
        dto.setQuantity(orderItem.getQuantity());
        dto.setUnitPrice(orderItem.getUnitPrice());
        dto.setTotalPrice(orderItem.getTotalPrice());
        dto.setSpecialInstructions(orderItem.getSpecialInstructions());
        
        if (orderItem.getMenuItem() != null) {
            dto.setMenuItemId(orderItem.getMenuItem().getId());
            dto.setMenuItemName(orderItem.getMenuItem().getName());
        }
        
        return dto;
    }
}