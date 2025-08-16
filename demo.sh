#!/bin/bash

echo "🍕 Food Delivery Application - Live Demonstration"
echo "================================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🚀 Starting the demonstration...${NC}"
echo ""

# Check if backend is running
echo -e "${YELLOW}1. Checking Backend Status...${NC}"
if curl -s http://localhost:8080/api/restaurants > /dev/null; then
    echo -e "${GREEN}✅ Backend is running on http://localhost:8080${NC}"
else
    echo -e "${YELLOW}⚠️  Backend not running. Starting it now...${NC}"
    cd backend && mvn spring-boot:run > /dev/null 2>&1 &
    sleep 30
    if curl -s http://localhost:8080/api/restaurants > /dev/null; then
        echo -e "${GREEN}✅ Backend started successfully${NC}"
    else
        echo -e "${RED}❌ Failed to start backend${NC}"
        exit 1
    fi
fi

# Check if frontend is running
echo -e "${YELLOW}2. Checking Frontend Status...${NC}"
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✅ Frontend is running on http://localhost:3000${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend not running. Starting it now...${NC}"
    cd frontend && npm start > /dev/null 2>&1 &
    sleep 60
    if curl -s http://localhost:3000 > /dev/null; then
        echo -e "${GREEN}✅ Frontend started successfully${NC}"
    else
        echo -e "${RED}❌ Failed to start frontend${NC}"
    fi
fi

echo ""
echo -e "${BLUE}🎯 Application Features Demonstration${NC}"
echo "=============================================="
echo ""

echo -e "${GREEN}✅ Backend API Endpoints:${NC}"
echo "   • http://localhost:8080/api/restaurants"
echo "   • http://localhost:8080/api/menu-items/restaurant/1"
echo "   • http://localhost:8080/api/auth/login"
echo "   • http://localhost:8080/api/orders"
echo ""

echo -e "${GREEN}✅ Frontend Pages:${NC}"
echo "   • http://localhost:3000 - Home page with restaurants"
echo "   • http://localhost:3000/login - User login"
echo "   • http://localhost:3000/register - User registration"
echo "   • http://localhost:3000/restaurant/1 - Restaurant details"
echo "   • http://localhost:3000/cart - Shopping cart"
echo "   • http://localhost:3000/orders - Order history"
echo ""

echo -e "${GREEN}✅ Sample Data Available:${NC}"
echo "   • Test User: user@example.com / password"
echo "   • Restaurant: Delicious Food Restaurant"
echo "   • Menu Items: Chicken Wings, Grilled Chicken, etc."
echo ""

echo -e "${BLUE}🎮 How to Test the Application:${NC}"
echo "========================================"
echo ""
echo "1. Open your browser and go to: http://localhost:3000"
echo ""
echo "2. Register a new account or login with:"
echo "   Email: user@example.com"
echo "   Password: password"
echo ""
echo "3. Browse the restaurant and add items to cart"
echo ""
echo "4. Go to cart and place an order"
echo ""
echo "5. View your order history"
echo ""

echo -e "${YELLOW}📊 Current Application Status:${NC}"
echo "======================================"

# Test API endpoints
echo -e "${YELLOW}Testing API endpoints...${NC}"

# Test restaurants endpoint
RESTAURANTS_COUNT=$(curl -s http://localhost:8080/api/restaurants | grep -o '"id"' | wc -l)
echo -e "   • Restaurants available: ${GREEN}$RESTAURANTS_COUNT${NC}"

# Test menu items endpoint
MENU_ITEMS_COUNT=$(curl -s http://localhost:8080/api/menu-items/restaurant/1 | grep -o '"id"' | wc -l)
echo -e "   • Menu items available: ${GREEN}$MENU_ITEMS_COUNT${NC}"

# Test authentication
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"user@example.com","password":"password"}')

if echo "$LOGIN_RESPONSE" | grep -q "token"; then
    echo -e "   • Authentication: ${GREEN}Working${NC}"
else
    echo -e "   • Authentication: ${RED}Failed${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Food Delivery Application is ready for use!${NC}"
echo ""
echo -e "${BLUE}📱 Access the application at: http://localhost:3000${NC}"
echo -e "${BLUE}🔧 API documentation at: http://localhost:8080/api${NC}"
echo ""
echo -e "${YELLOW}💡 Tips:${NC}"
echo "   • Use the browser's developer tools to see API calls"
echo "   • Check the Redux DevTools for state management"
echo "   • Try different user roles and permissions"
echo "   • Test the responsive design on different screen sizes"
echo ""
echo -e "${GREEN}🚀 Happy testing!${NC}"