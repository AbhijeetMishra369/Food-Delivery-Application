package com.fooddelivery.repository;

import com.fooddelivery.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByPhone(String phone);
    
    boolean existsByEmail(String email);
    
    boolean existsByPhone(String phone);
    
    @Query("SELECT u FROM User u WHERE u.email = ?1 AND u.enabled = true")
    Optional<User> findActiveUserByEmail(String email);
    
    @Query("SELECT u FROM User u WHERE u.role = 'RESTAURANT_OWNER'")
    List<User> findAllRestaurantOwners();
}