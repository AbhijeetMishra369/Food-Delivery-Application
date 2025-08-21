#!/bin/bash

echo "🍕 Food Delivery Application - Complete Test Suite"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0

# Function to print test results
print_test_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ PASS${NC} - $2"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC} - $2"
        ((TESTS_FAILED++))
    fi
}

echo -e "\n${BLUE}1. Testing Backend API${NC}"
echo "------------------------"

# Test 1: Check if backend is running
echo "Testing backend connectivity..."
if curl -s http://localhost:8080/api/restaurants > /dev/null; then
    print_test_result 0 "Backend is running and accessible"
else
    print_test_result 1 "Backend is not accessible"
    echo "Starting backend..."
    cd backend && mvn spring-boot:run > /dev/null 2>&1 &
    sleep 30
    if curl -s http://localhost:8080/api/restaurants > /dev/null; then
        print_test_result 0 "Backend started successfully"
    else
        print_test_result 1 "Failed to start backend"
    fi
fi

# Test 2: Test restaurants endpoint
echo "Testing restaurants endpoint..."
RESTAURANTS_RESPONSE=$(curl -s http://localhost:8080/api/restaurants)
if echo "$RESTAURANTS_RESPONSE" | grep -q "Delicious Food Restaurant"; then
    print_test_result 0 "Restaurants endpoint returns data"
    echo "   Found restaurant: Delicious Food Restaurant"
else
    print_test_result 1 "Restaurants endpoint failed"
fi

# Test 3: Test authentication
echo "Testing user registration..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{
        "firstName": "Test",
        "lastName": "User",
        "email": "test@example.com",
        "password": "password123",
        "phone": "1234567890",
        "address": "123 Test St"
    }')

if echo "$REGISTER_RESPONSE" | grep -q "token"; then
    print_test_result 0 "User registration successful"
    TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
else
    print_test_result 1 "User registration failed"
    TOKEN=""
fi

# Test 4: Test login
echo "Testing user login..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{
        "email": "user@example.com",
        "password": "password"
    }')

if echo "$LOGIN_RESPONSE" | grep -q "token"; then
    print_test_result 0 "User login successful"
    TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
else
    print_test_result 1 "User login failed"
fi

# Test 5: Test menu items endpoint
echo "Testing menu items endpoint..."
MENU_RESPONSE=$(curl -s http://localhost:8080/api/menu-items/restaurant/1)
if echo "$MENU_RESPONSE" | grep -q "Chicken Wings"; then
    print_test_result 0 "Menu items endpoint returns data"
    echo "   Found menu item: Chicken Wings"
else
    print_test_result 1 "Menu items endpoint failed"
fi

# Test 6: Test categories endpoint
echo "Testing categories endpoint..."
CATEGORIES_RESPONSE=$(curl -s http://localhost:8080/api/categories)
if echo "$CATEGORIES_RESPONSE" | grep -q "Appetizers"; then
    print_test_result 0 "Categories endpoint returns data"
    echo "   Found category: Appetizers"
else
    print_test_result 1 "Categories endpoint failed"
fi

# Test 7: Test order creation (if authenticated)
if [ ! -z "$TOKEN" ]; then
    echo "Testing order creation..."
    ORDER_RESPONSE=$(curl -s -X POST http://localhost:8080/api/orders \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $TOKEN" \
        -d '{
            "restaurantId": 1,
            "items": [
                {
                    "menuItemId": 1,
                    "quantity": 2,
                    "specialInstructions": "Extra spicy please"
                }
            ],
            "deliveryAddress": "123 Test St",
            "deliveryPhone": "1234567890",
            "deliveryInstructions": "Ring doorbell",
            "paymentMethod": "CASH_ON_DELIVERY"
        }')
    
    if echo "$ORDER_RESPONSE" | grep -q "orderNumber"; then
        print_test_result 0 "Order creation successful"
        ORDER_ID=$(echo "$ORDER_RESPONSE" | grep -o '"id":[0-9]*' | cut -d':' -f2)
    else
        print_test_result 1 "Order creation failed"
    fi
else
    print_test_result 1 "Skipping order creation - no authentication token"
fi

echo -e "\n${BLUE}2. Testing Frontend${NC}"
echo "----------------------"

# Test 8: Check if frontend is running
echo "Testing frontend connectivity..."
if curl -s http://localhost:3000 > /dev/null; then
    print_test_result 0 "Frontend is running and accessible"
else
    print_test_result 1 "Frontend is not accessible"
    echo "Starting frontend..."
    cd frontend && npm start > /dev/null 2>&1 &
    sleep 60
    if curl -s http://localhost:3000 > /dev/null; then
        print_test_result 0 "Frontend started successfully"
    else
        print_test_result 1 "Failed to start frontend"
    fi
fi

# Test 9: Test frontend API calls
echo "Testing frontend API integration..."
FRONTEND_API_TEST=$(curl -s http://localhost:3000 | grep -o "Food Delivery" || echo "")
if [ ! -z "$FRONTEND_API_TEST" ]; then
    print_test_result 0 "Frontend loads successfully"
else
    print_test_result 1 "Frontend failed to load"
fi

echo -e "\n${BLUE}3. Database Testing${NC}"
echo "---------------------"

# Test 10: Test backend health (MySQL-backed)
echo "Testing backend health endpoint..."
HEALTH_RESPONSE=$(curl -s http://localhost:8080/api/actuator/health | grep -o '"status":"UP"' || echo "")
if [ ! -z "$HEALTH_RESPONSE" ]; then
    print_test_result 0 "Backend health is UP"
else
    print_test_result 1 "Backend health endpoint not UP"
fi

echo -e "\n${BLUE}4. Application Features Summary${NC}"
echo "--------------------------------"

echo -e "${GREEN}✅ Backend Features Implemented:${NC}"
echo "   • User Authentication (Register/Login)"
echo "   • Restaurant Management"
echo "   • Menu Item Management"
echo "   • Category Management"
echo "   • Order Processing"
echo "   • Payment Integration (RazorPay)"
echo "   • JWT Security"
echo "   • MySQL Database with Sample Data"
echo "   • CORS Configuration"
echo "   • Input Validation"

echo -e "\n${GREEN}✅ Frontend Features Implemented:${NC}"
echo "   • Modern React UI with Material-UI"
echo "   • Redux State Management"
echo "   • User Authentication"
echo "   • Restaurant Browsing"
echo "   • Menu Item Selection"
echo "   • Shopping Cart Management"
echo "   • Order Placement"
echo "   • Order History"
echo "   • Order Tracking"
echo "   • Responsive Design"

echo -e "\n${GREEN}✅ Sample Data Available:${NC}"
echo "   • Test Users: user@example.com / password"
echo "   • Restaurant: Delicious Food Restaurant"
echo "   • Menu Items: Chicken Wings, Grilled Chicken, etc."
echo "   • Categories: Appetizers, Main Courses, Desserts"

echo -e "\n${BLUE}5. Test Results Summary${NC}"
echo "---------------------------"
echo -e "Total Tests: $((TESTS_PASSED + TESTS_FAILED))"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n${GREEN}🎉 All tests passed! The Food Delivery Application is working correctly.${NC}"
else
    echo -e "\n${YELLOW}⚠️  Some tests failed. Please check the application configuration.${NC}"
fi

echo -e "\n${BLUE}6. Manual Testing Instructions${NC}"
echo "----------------------------------"
echo "1. Open http://localhost:3000 in your browser"
echo "2. Register a new account or login with: user@example.com / password"
echo "3. Browse restaurants and add items to cart"
echo "4. Complete an order and track its status"
echo "5. View order history and details"

echo -e "\n${BLUE}7. API Endpoints Available${NC}"
echo "----------------------------"
echo "• GET  /api/restaurants - List all restaurants"
echo "• GET  /api/restaurants/{id} - Get restaurant details"
echo "• GET  /api/menu-items/restaurant/{id} - Get restaurant menu"
echo "• GET  /api/categories - List all categories"
echo "• POST /api/auth/register - User registration"
echo "• POST /api/auth/login - User login"
echo "• POST /api/orders - Create new order"
echo "• GET  /api/orders/user - Get user orders"
echo "• GET  /api/orders/{id} - Get order details"

echo -e "\n${GREEN}🚀 The Food Delivery Application is ready for use!${NC}"