package com.fooddelivery.service;

import com.fooddelivery.dto.OrderDto;
import com.fooddelivery.dto.OrderRequest;
import com.fooddelivery.entity.*;
import com.fooddelivery.repository.OrderRepository;
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
    private final UserService userService;
    private final RestaurantService restaurantService;
    private final MenuItemService menuItemService;
    
    @Transactional
    public OrderDto createOrder(OrderRequest request, Long userId) {
        User user = userService.getUserById(userId);
        Restaurant restaurant = restaurantService.getRestaurantById(request.getRestaurantId());
        
        Order order = new Order();
        order.setUser(user);
        order.setRestaurant(restaurant);
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setDeliveryPhone(request.getDeliveryPhone());
        order.setDeliveryInstructions(request.getDeliveryInstructions());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setEstimatedDeliveryTime(LocalDateTime.now().plusMinutes(restaurant.getDeliveryTime()));
        
        // Calculate order totals
        double subtotal = 0.0;
        List<OrderItem> orderItems = request.getItems().stream()
                .map(itemRequest -> {
                    MenuItem menuItem = menuItemService.getMenuItemById(itemRequest.getMenuItemId());
                    OrderItem orderItem = new OrderItem();
                    orderItem.setOrder(order);
                    orderItem.setMenuItem(menuItem);
                    orderItem.setQuantity(itemRequest.getQuantity());
                    orderItem.setUnitPrice(menuItem.getPrice());
                    orderItem.setTotalPrice(menuItem.getPrice() * itemRequest.getQuantity());
                    orderItem.setSpecialInstructions(itemRequest.getSpecialInstructions());
                    return orderItem;
                })
                .collect(Collectors.toList());
        
        subtotal = orderItems.stream()
                .mapToDouble(OrderItem::getTotalPrice)
                .sum();
        
        order.setOrderItems(orderItems);
        order.setSubtotal(subtotal);
        order.setDeliveryFee(restaurant.getDeliveryFee());
        order.setTax(subtotal * 0.05); // 5% tax
        order.setTotal(subtotal + order.getDeliveryFee() + order.getTax());
        
        Order savedOrder = orderRepository.save(order);
        return convertToDto(savedOrder);
    }
    
    public List<OrderDto> getUserOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public Page<OrderDto> getUserOrders(Long userId, Pageable pageable) {
        return orderRepository.findByUserId(userId, pageable)
                .map(this::convertToDto);
    }
    
    public List<OrderDto> getRestaurantOrders(Long restaurantId) {
        return orderRepository.findByRestaurantIdOrderByCreatedAtDesc(restaurantId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public Page<OrderDto> getRestaurantOrders(Long restaurantId, Pageable pageable) {
        return orderRepository.findByRestaurantId(restaurantId, pageable)
                .map(this::convertToDto);
    }
    
    public OrderDto getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return convertToDto(order);
    }
    
    public OrderDto getOrderByOrderNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return convertToDto(order);
    }
    
    @Transactional
    public OrderDto updateOrderStatus(Long orderId, Order.OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        order.setStatus(status);
        
        if (status == Order.OrderStatus.DELIVERED) {
            order.setActualDeliveryTime(LocalDateTime.now());
        }
        
        Order updatedOrder = orderRepository.save(order);
        return convertToDto(updatedOrder);
    }
    
    @Transactional
    public OrderDto updateOrderPaymentStatus(Long orderId, Order.PaymentStatus paymentStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        order.setPaymentStatus(paymentStatus);
        
        Order updatedOrder = orderRepository.save(order);
        return convertToDto(updatedOrder);
    }
    
    private OrderDto convertToDto(Order order) {
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setUserId(order.getUser().getId());
        dto.setUserName(order.getUser().getFirstName() + " " + order.getUser().getLastName());
        dto.setRestaurantId(order.getRestaurant().getId());
        dto.setRestaurantName(order.getRestaurant().getName());
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
        
        dto.setOrderItems(order.getOrderItems().stream()
                .map(this::convertToOrderItemDto)
                .collect(Collectors.toList()));
        
        return dto;
    }
    
    private OrderDto.OrderItemDto convertToOrderItemDto(OrderItem orderItem) {
        OrderDto.OrderItemDto dto = new OrderDto.OrderItemDto();
        dto.setId(orderItem.getId());
        dto.setMenuItemId(orderItem.getMenuItem().getId());
        dto.setMenuItemName(orderItem.getMenuItem().getName());
        dto.setQuantity(orderItem.getQuantity());
        dto.setUnitPrice(orderItem.getUnitPrice());
        dto.setTotalPrice(orderItem.getTotalPrice());
        dto.setSpecialInstructions(orderItem.getSpecialInstructions());
        return dto;
    }
}