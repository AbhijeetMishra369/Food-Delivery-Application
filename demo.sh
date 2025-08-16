#!/bin/bash

echo "🍕 Food Delivery Application - Demo & Showcase"
echo "=============================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "\n${BLUE}🚀 Application Status Check${NC}"
echo "------------------------------"

# Check if backend is running
if curl -s http://localhost:8080/api/restaurants > /dev/null; then
    echo -e "${GREEN}✅ Backend is running on http://localhost:8080${NC}"
else
    echo -e "${YELLOW}⚠️  Backend is not running. Starting...${NC}"
    cd backend && mvn spring-boot:run > /dev/null 2>&1 &
    echo "   Waiting for backend to start..."
    sleep 30
    if curl -s http://localhost:8080/api/restaurants > /dev/null; then
        echo -e "${GREEN}✅ Backend started successfully${NC}"
    else
        echo -e "${YELLOW}⚠️  Backend may still be starting up${NC}"
    fi
fi

# Check if frontend is running
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✅ Frontend is running on http://localhost:3000${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend is not running. Starting...${NC}"
    cd frontend && npm start > /dev/null 2>&1 &
    echo "   Waiting for frontend to start..."
    sleep 60
    if curl -s http://localhost:3000 > /dev/null; then
        echo -e "${GREEN}✅ Frontend started successfully${NC}"
    else
        echo -e "${YELLOW}⚠️  Frontend may still be starting up${NC}"
    fi
fi

echo -e "\n${BLUE}📋 Key Application Features${NC}"
echo "----------------------------"

echo -e "${GREEN}🔐 Authentication System:${NC}"
echo "   • User Registration with validation"
echo "   • Secure Login with JWT tokens"
echo "   • Password encryption"
echo "   • Role-based access control"

echo -e "\n${GREEN}🏪 Restaurant Management:${NC}"
echo "   • Browse restaurants with search"
echo "   • View restaurant details and ratings"
echo "   • Filter by cuisine type"
echo "   • Real-time availability status"

echo -e "\n${GREEN}🍽️  Menu & Ordering:${NC}"
echo "   • Browse menu items by category"
echo "   • Search menu items"
echo "   • Add items to cart"
echo "   • Quantity management"
echo "   • Special instructions"

echo -e "\n${GREEN}🛒 Shopping Cart:${NC}"
echo "   • Add/remove items"
echo "   • Update quantities"
echo "   • Cart persistence"
echo "   • Restaurant-specific cart"

echo -e "\n${GREEN}📦 Order Management:${NC}"
echo "   • Place orders with delivery details"
echo "   • Order confirmation"
echo "   • Order tracking with status updates"
echo "   • Order history"
echo "   • Payment integration"

echo -e "\n${BLUE}🎯 Sample Data Available${NC}"
echo "---------------------------"

echo -e "${GREEN}👤 Test Users:${NC}"
echo "   • Email: user@example.com"
echo "   • Password: password"
echo "   • Role: Regular User"

echo -e "\n${GREEN}🏪 Sample Restaurant:${NC}"
echo "   • Name: Delicious Food Restaurant"
echo "   • Cuisine: International"
echo "   • Rating: 4.5/5"
echo "   • Delivery Time: 30-45 minutes"

echo -e "\n${GREEN}🍽️  Sample Menu Items:${NC}"
echo "   • Appetizers: Chicken Wings, Caesar Salad"
echo "   • Main Courses: Grilled Chicken, Beef Burger"
echo "   • Desserts: Chocolate Cake, Ice Cream"
echo "   • Beverages: Soft Drinks, Coffee"

echo -e "\n${BLUE}🔗 API Endpoints${NC}"
echo "----------------"

echo "Authentication:"
echo "   POST /api/auth/register - User registration"
echo "   POST /api/auth/login - User login"

echo -e "\nRestaurants:"
echo "   GET  /api/restaurants - List all restaurants"
echo "   GET  /api/restaurants/{id} - Get restaurant details"
echo "   GET  /api/restaurants/search?q={query} - Search restaurants"

echo -e "\nMenu Items:"
echo "   GET  /api/menu-items/restaurant/{id} - Get restaurant menu"
echo "   GET  /api/menu-items/category/{categoryId} - Get items by category"
echo "   GET  /api/categories - List all categories"

echo -e "\nOrders:"
echo "   POST /api/orders - Create new order"
echo "   GET  /api/orders/user - Get user orders"
echo "   GET  /api/orders/{id} - Get order details"

echo -e "\n${BLUE}🧪 Manual Testing Guide${NC}"
echo "---------------------------"

echo "1. ${GREEN}Open the Application:${NC}"
echo "   • Navigate to http://localhost:3000"
echo "   • You should see the home page with restaurants"

echo -e "\n2. ${GREEN}User Registration:${NC}"
echo "   • Click 'Register' in the header"
echo "   • Fill in all required fields"
echo "   • Submit the form"
echo "   • You should be redirected to the home page"

echo -e "\n3. ${GREEN}User Login:${NC}"
echo "   • Click 'Login' in the header"
echo "   • Use: user@example.com / password"
echo "   • You should see your name in the header"

echo -e "\n4. ${GREEN}Browse Restaurants:${NC}"
echo "   • View the list of restaurants"
echo "   • Use the search bar to find specific restaurants"
echo "   • Click on a restaurant to view its menu"

echo -e "\n5. ${GREEN}Add Items to Cart:${NC}"
echo "   • Browse menu items in a restaurant"
echo "   • Use category tabs to filter items"
echo "   • Search for specific menu items"
echo "   • Click 'Add to Cart' for desired items"
echo "   • Adjust quantities using +/- buttons"

echo -e "\n6. ${GREEN}Place an Order:${NC}"
echo "   • Click the cart icon in the header"
echo "   • Review your cart items"
echo "   • Fill in delivery information"
echo "   • Click 'Place Order'"
echo "   • Confirm the order in the dialog"

echo -e "\n7. ${GREEN}Track Orders:${NC}"
echo "   • Click your profile menu → 'My Orders'"
echo "   • View order history"
echo "   • Click 'View Details' to see order progress"
echo "   • Check the order status and timeline"

echo -e "\n${BLUE}🔧 Technical Features${NC}"
echo "------------------------"

echo -e "${GREEN}Backend (Spring Boot):${NC}"
echo "   • RESTful API design"
echo "   • JWT authentication"
echo "   • Spring Security"
echo "   • H2 in-memory database"
echo "   • JPA/Hibernate ORM"
echo "   • Input validation"
echo "   • CORS configuration"
echo "   • RazorPay payment integration"

echo -e "\n${GREEN}Frontend (React):${NC}"
echo "   • Modern React 18 with hooks"
echo "   • Material-UI components"
echo "   • Redux Toolkit for state management"
echo "   • React Router for navigation"
echo "   • Axios for API calls"
echo "   • Responsive design"
echo "   • Form validation"
echo "   • Loading states and error handling"

echo -e "\n${GREEN}Database Schema:${NC}"
echo "   • Users (authentication & profiles)"
echo "   • Restaurants (details & ratings)"
echo "   • Categories (menu organization)"
echo "   • Menu Items (food items & prices)"
echo "   • Orders (order management)"
echo "   • Order Items (order details)"
echo "   • Payments (payment tracking)"

echo -e "\n${BLUE}🎨 UI/UX Features${NC}"
echo "---------------------"

echo "• Responsive design for all screen sizes"
echo "• Modern Material-UI components"
echo "• Intuitive navigation"
echo "• Loading indicators"
echo "• Error handling with user-friendly messages"
echo "• Form validation with real-time feedback"
echo "• Order progress tracking with visual stepper"
echo "• Shopping cart with quantity controls"
echo "• Search and filtering capabilities"

echo -e "\n${GREEN}🚀 Ready to Use!${NC}"
echo "======================"
echo "The Food Delivery Application is fully functional with:"
echo "• Complete user authentication"
echo "• Restaurant browsing and search"
echo "• Menu item selection and cart management"
echo "• Order placement and tracking"
echo "• Responsive and modern UI"
echo "• Comprehensive API endpoints"
echo "• Sample data for testing"

echo -e "\n${YELLOW}💡 Pro Tips:${NC}"
echo "• Use the search functionality to find specific restaurants or menu items"
echo "• Try different categories to explore the menu"
echo "• Check the order tracking feature to see the delivery progress"
echo "• Test the responsive design by resizing your browser window"
echo "• Explore the API endpoints using tools like Postman or curl"

echo -e "\n${GREEN}🎉 Enjoy your Food Delivery Application!${NC}"