-- MySQL Setup Script for Food Delivery Application
-- Run this script to create the database and user

-- Create database
CREATE DATABASE IF NOT EXISTS food_delivery CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user (optional - you can use root user)
-- CREATE USER 'fooddelivery'@'localhost' IDENTIFIED BY 'password';
-- GRANT ALL PRIVILEGES ON food_delivery.* TO 'fooddelivery'@'localhost';
-- FLUSH PRIVILEGES;

-- Use the database
USE food_delivery;

-- Show tables (will be created by JPA/Hibernate)
SHOW TABLES;

-- Note: The application will automatically create all tables when it starts
-- due to spring.jpa.hibernate.ddl-auto=update configuration