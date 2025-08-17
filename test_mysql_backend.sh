#!/bin/bash

echo "🍕 Testing MySQL Backend for Food Delivery Application"
echo "======================================================"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
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

echo -e "\n${BLUE}1. MySQL Database Setup${NC}"
echo "-------------------------"

# Test 1: Check if MySQL is running
echo "Testing MySQL service..."
if systemctl is-active --quiet mysql; then
    print_test_result 0 "MySQL service is running"
else
    print_test_result 1 "MySQL service is not running"
    echo "Starting MySQL..."
    sudo systemctl start mysql
    sleep 3
    if systemctl is-active --quiet mysql; then
        print_test_result 0 "MySQL service started successfully"
    else
        print_test_result 1 "Failed to start MySQL service"
    fi
fi

# Test 2: Test MySQL connection
echo "Testing MySQL connection..."
if mysql -u root -p -e "SELECT 1;" > /dev/null 2>&1; then
    print_test_result 0 "MySQL connection successful"
else
    print_test_result 1 "MySQL connection failed"
fi

# Test 3: Create database if not exists
echo "Testing database creation..."
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS food_delivery CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    print_test_result 0 "Database creation/verification successful"
else
    print_test_result 1 "Database creation failed"
fi

echo -e "\n${BLUE}2. Backend Compilation${NC}"
echo "------------------------"

# Test 4: Compile backend
echo "Testing backend compilation..."
cd backend
if mvn clean compile -q; then
    print_test_result 0 "Backend compilation successful"
else
    print_test_result 1 "Backend compilation failed"
    echo "Compilation errors:"
    mvn clean compile
    exit 1
fi

echo -e "\n${BLUE}3. Backend Startup Test${NC}"
echo "---------------------------"

# Test 5: Start backend in background
echo "Starting backend application..."
mvn spring-boot:run > backend.log 2>&1 &
BACKEND_PID=$!

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 30

# Test 6: Check if backend is responding
echo "Testing backend connectivity..."
if curl -s http://localhost:8080/api/restaurants > /dev/null; then
    print_test_result 0 "Backend is running and responding"
else
    print_test_result 1 "Backend is not responding"
    echo "Backend logs:"
    tail -20 backend.log
fi

# Test 7: Test database integration
echo "Testing database integration..."
RESTAURANTS_RESPONSE=$(curl -s http://localhost:8080/api/restaurants)
if echo "$RESTAURANTS_RESPONSE" | grep -q "Delicious Food Restaurant"; then
    print_test_result 0 "Database integration working - sample data loaded"
    echo "   Found restaurant: Delicious Food Restaurant"
else
    print_test_result 1 "Database integration failed - no sample data"
fi

# Test 8: Test authentication
echo "Testing authentication..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{
        "email": "user@example.com",
        "password": "password"
    }')

if echo "$LOGIN_RESPONSE" | grep -q "token"; then
    print_test_result 0 "Authentication working"
    TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
else
    print_test_result 1 "Authentication failed"
fi

# Test 9: Test order creation (if authenticated)
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
    else
        print_test_result 1 "Order creation failed"
    fi
else
    print_test_result 1 "Skipping order creation - no authentication token"
fi

# Stop backend
echo "Stopping backend..."
kill $BACKEND_PID 2>/dev/null
wait $BACKEND_PID 2>/dev/null

echo -e "\n${BLUE}4. Database Verification${NC}"
echo "-------------------------"

# Test 10: Check database tables
echo "Testing database tables..."
TABLES=$(mysql -u root -p -e "USE food_delivery; SHOW TABLES;" 2>/dev/null | grep -v "Tables_in" | wc -l)
if [ "$TABLES" -gt 0 ]; then
    print_test_result 0 "Database tables created successfully ($TABLES tables)"
else
    print_test_result 1 "No database tables found"
fi

echo -e "\n${BLUE}5. Test Results Summary${NC}"
echo "---------------------------"
echo -e "Total Tests: $((TESTS_PASSED + TESTS_FAILED))"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n${GREEN}🎉 All tests passed! MySQL backend is working correctly.${NC}"
    echo -e "\n${BLUE}Next Steps:${NC}"
    echo "1. Start the backend: cd backend && mvn spring-boot:run"
    echo "2. Start the frontend: cd frontend && npm start"
    echo "3. Access the application at http://localhost:3000"
    echo "4. Test credentials: user@example.com / password"
else
    echo -e "\n${YELLOW}⚠️  Some tests failed. Please check the configuration.${NC}"
    echo -e "\n${BLUE}Troubleshooting:${NC}"
    echo "1. Ensure MySQL is running: sudo systemctl status mysql"
    echo "2. Check MySQL credentials in application.properties"
    echo "3. Verify database exists: mysql -u root -p -e 'SHOW DATABASES;'"
    echo "4. Check backend logs for detailed error messages"
fi

echo -e "\n${GREEN}🚀 MySQL Backend Test Complete!${NC}"