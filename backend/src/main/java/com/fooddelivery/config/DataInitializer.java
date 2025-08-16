package com.fooddelivery.config;

import com.fooddelivery.entity.*;
import com.fooddelivery.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;
    private final CategoryRepository categoryRepository;
    private final MenuItemRepository menuItemRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // Create sample users
        User user1 = new User();
        user1.setEmail("user@example.com");
        user1.setPassword(passwordEncoder.encode("password"));
        user1.setFirstName("John");
        user1.setLastName("Doe");
        user1.setPhone("1234567890");
        user1.setAddress("123 Main St, City");
        user1.setRole(User.Role.USER);
        userRepository.save(user1);
        
        User restaurantOwner = new User();
        restaurantOwner.setEmail("owner@restaurant.com");
        restaurantOwner.setPassword(passwordEncoder.encode("password"));
        restaurantOwner.setFirstName("Restaurant");
        restaurantOwner.setLastName("Owner");
        restaurantOwner.setPhone("9876543210");
        restaurantOwner.setAddress("456 Restaurant Ave, City");
        restaurantOwner.setRole(User.Role.RESTAURANT_OWNER);
        userRepository.save(restaurantOwner);
        
        // Create sample categories
        Category appetizers = new Category();
        appetizers.setName("Appetizers");
        appetizers.setDescription("Start your meal with these delicious appetizers");
        categoryRepository.save(appetizers);
        
        Category mainCourse = new Category();
        mainCourse.setName("Main Course");
        mainCourse.setDescription("Delicious main dishes");
        categoryRepository.save(mainCourse);
        
        Category desserts = new Category();
        desserts.setName("Desserts");
        desserts.setDescription("Sweet treats to end your meal");
        categoryRepository.save(desserts);
        
        // Create sample restaurant
        Restaurant restaurant = new Restaurant();
        restaurant.setName("Delicious Food Restaurant");
        restaurant.setDescription("Serving the best food in town");
        restaurant.setAddress("789 Food Street, City");
        restaurant.setPhone("5551234567");
        restaurant.setEmail("info@deliciousfood.com");
        restaurant.setCuisine("International");
        restaurant.setRating(4.5);
        restaurant.setReviewCount(100);
        restaurant.setDeliveryTime(30);
        restaurant.setDeliveryFee(5.0);
        restaurant.setMinimumOrder(20.0);
        restaurant.setOwner(restaurantOwner);
        restaurantRepository.save(restaurant);
        
        // Create sample menu items
        MenuItem item1 = new MenuItem();
        item1.setName("Chicken Wings");
        item1.setDescription("Crispy chicken wings with your choice of sauce");
        item1.setPrice(12.99);
        item1.setIsVegetarian(false);
        item1.setIsSpicy(true);
        item1.setPreparationTime(15);
        item1.setRestaurant(restaurant);
        item1.setCategory(appetizers);
        menuItemRepository.save(item1);
        
        MenuItem item2 = new MenuItem();
        item2.setName("Grilled Chicken");
        item2.setDescription("Grilled chicken breast with herbs and spices");
        item2.setPrice(18.99);
        item2.setIsVegetarian(false);
        item2.setIsSpicy(false);
        item2.setPreparationTime(20);
        item2.setRestaurant(restaurant);
        item2.setCategory(mainCourse);
        menuItemRepository.save(item2);
        
        MenuItem item3 = new MenuItem();
        item3.setName("Chocolate Cake");
        item3.setDescription("Rich chocolate cake with chocolate frosting");
        item3.setPrice(8.99);
        item3.setIsVegetarian(true);
        item3.setIsSpicy(false);
        item3.setPreparationTime(5);
        item3.setRestaurant(restaurant);
        item3.setCategory(desserts);
        menuItemRepository.save(item3);
        
        MenuItem item4 = new MenuItem();
        item4.setName("Caesar Salad");
        item4.setDescription("Fresh romaine lettuce with Caesar dressing");
        item4.setPrice(10.99);
        item4.setIsVegetarian(true);
        item4.setIsSpicy(false);
        item4.setPreparationTime(10);
        item4.setRestaurant(restaurant);
        item4.setCategory(appetizers);
        menuItemRepository.save(item4);
        
        System.out.println("Sample data initialized successfully!");
    }
}