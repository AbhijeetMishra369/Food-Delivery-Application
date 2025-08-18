package com.fooddelivery.config;

import com.fooddelivery.entity.Category;
import com.fooddelivery.entity.MenuItem;
import com.fooddelivery.entity.Restaurant;
import com.fooddelivery.entity.User;
import com.fooddelivery.repository.CategoryRepository;
import com.fooddelivery.repository.MenuItemRepository;
import com.fooddelivery.repository.RestaurantRepository;
import com.fooddelivery.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;
    private final CategoryRepository categoryRepository;
    private final MenuItemRepository menuItemRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            log.info("Initializing sample data...");
            
            // Create Users
            User adminUser = new User();
            adminUser.setEmail("admin@example.com");
            adminUser.setPassword(passwordEncoder.encode("adminpassword"));
            adminUser.setFirstName("Admin");
            adminUser.setLastName("User");
            adminUser.setPhone("9876543210");
            adminUser.setAddress("123 Admin St");
            adminUser.setRole(User.UserRole.ADMIN);
            adminUser.setEnabled(true);
            
            User regularUser = new User();
            regularUser.setEmail("user@example.com");
            regularUser.setPassword(passwordEncoder.encode("password"));
            regularUser.setFirstName("Regular");
            regularUser.setLastName("User");
            regularUser.setPhone("5550000001");
            regularUser.setAddress("456 User Ave");
            regularUser.setRole(User.UserRole.USER);
            regularUser.setEnabled(true);
            
            User restaurantOwner = new User();
            restaurantOwner.setEmail("owner@example.com");
            restaurantOwner.setPassword(passwordEncoder.encode("ownerpassword"));
            restaurantOwner.setFirstName("Restaurant");
            restaurantOwner.setLastName("Owner");
            restaurantOwner.setPhone("1122334455");
            restaurantOwner.setAddress("789 Owner Blvd");
            restaurantOwner.setRole(User.UserRole.RESTAURANT_OWNER);
            restaurantOwner.setEnabled(true);
            
            userRepository.saveAll(Arrays.asList(adminUser, regularUser, restaurantOwner));
            
            // Create Categories
            Category appetizers = new Category();
            appetizers.setName("Appetizers");
            appetizers.setDescription("Delicious starters");
            appetizers.setImageUrl("https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop");
            appetizers.setActive(true);
            
            Category mainCourses = new Category();
            mainCourses.setName("Main Courses");
            mainCourses.setDescription("Hearty main dishes");
            mainCourses.setImageUrl("https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1600&auto=format&fit=crop");
            mainCourses.setActive(true);
            
            Category desserts = new Category();
            desserts.setName("Desserts");
            desserts.setDescription("Sweet treats");
            desserts.setImageUrl("https://images.unsplash.com/photo-1541787286035-6c6a05f78c9a?q=80&w=1600&auto=format&fit=crop");
            desserts.setActive(true);
            
            categoryRepository.saveAll(Arrays.asList(appetizers, mainCourses, desserts));
            
            // Create Restaurant
            Restaurant restaurant = new Restaurant();
            restaurant.setName("Delicious Food Restaurant");
            restaurant.setDescription("Serving the best food in town!");
            restaurant.setAddress("101 Foodie Lane");
            restaurant.setPhone("555-123-4567");
            restaurant.setEmail("info@deliciousfood.com");
            restaurant.setCuisine("American");
            restaurant.setImageUrl("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600&auto=format&fit=crop");
            restaurant.setRating(4.5);
            restaurant.setReviewCount(120);
            restaurant.setActive(true);
            restaurant.setOpen(true);
            restaurant.setDeliveryTime(30);
            restaurant.setDeliveryFee(5.0);
            restaurant.setMinimumOrder(10.0);
            restaurant.setOwner(restaurantOwner);
            
            restaurantRepository.save(restaurant);
            
            // Create Menu Items
            MenuItem item1 = new MenuItem();
            item1.setName("Chicken Wings");
            item1.setDescription("Crispy chicken wings with your choice of sauce.");
            item1.setPrice(12.99);
            item1.setImageUrl("https://images.unsplash.com/photo-1562967916-eb82221dfb36?q=80&w=1600&auto=format&fit=crop");
            item1.setVegetarian(false);
            item1.setSpicy(true);
            item1.setAvailable(true);
            item1.setPreparationTime(20);
            item1.setRestaurant(restaurant);
            item1.setCategory(appetizers);
            
            MenuItem item2 = new MenuItem();
            item2.setName("Grilled Chicken");
            item2.setDescription("Healthy grilled chicken breast with seasonal vegetables.");
            item2.setPrice(15.99);
            item2.setImageUrl("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1600&auto=format&fit=crop");
            item2.setVegetarian(false);
            item2.setSpicy(false);
            item2.setAvailable(true);
            item2.setPreparationTime(25);
            item2.setRestaurant(restaurant);
            item2.setCategory(mainCourses);
            
            MenuItem item3 = new MenuItem();
            item3.setName("Chocolate Cake");
            item3.setDescription("Rich chocolate cake with a scoop of vanilla ice cream.");
            item3.setPrice(8.99);
            item3.setImageUrl("https://images.unsplash.com/photo-1541782814452-d07b16b69c96?q=80&w=1600&auto=format&fit=crop");
            item3.setVegetarian(true);
            item3.setSpicy(false);
            item3.setAvailable(true);
            item3.setPreparationTime(10);
            item3.setRestaurant(restaurant);
            item3.setCategory(desserts);
            
            MenuItem item4 = new MenuItem();
            item4.setName("Caesar Salad");
            item4.setDescription("Fresh romaine lettuce, croutons, parmesan cheese, and Caesar dressing.");
            item4.setPrice(10.99);
            item4.setImageUrl("https://images.unsplash.com/photo-1551248429-40975aa4de74?q=80&w=1600&auto=format&fit=crop");
            item4.setVegetarian(true);
            item4.setSpicy(false);
            item4.setAvailable(true);
            item4.setPreparationTime(15);
            item4.setRestaurant(restaurant);
            item4.setCategory(appetizers);
            
            menuItemRepository.saveAll(Arrays.asList(item1, item2, item3, item4));
            
            log.info("Sample data initialized successfully!");
        }
    }
}