# 🍕 Food Delivery Application

A comprehensive full-stack food delivery platform built with Spring Boot, React, and MySQL. Users can browse restaurants, order food, and track deliveries with integrated payment processing.

## ✨ Features

### 🏪 Restaurant Management
- Browse restaurants with ratings, delivery times, and cuisine types
- View detailed restaurant information and menus
- Filter restaurants by cuisine, rating, and delivery time

### 🍽️ Menu & Ordering
- Browse restaurant menus with detailed item information
- Add items to cart with quantity selection
- Real-time cart management
- Special dietary indicators (vegetarian, spicy)

### 🛒 Shopping Cart
- Add/remove items with quantity controls
- Real-time total calculation
- Cart persistence across sessions
- Restaurant-specific cart management

### 📦 Order Management
- Place orders with delivery information
- Track order status in real-time
- View order history
- Detailed order information

### 💳 Payment Integration
- RazorPay payment gateway integration
- Multiple payment methods
- Secure payment processing
- Payment status tracking

### 🔐 User Authentication
- User registration and login
- JWT-based authentication
- Role-based access control
- Secure password handling

## 🛠️ Technology Stack

### Backend
- **Spring Boot 3.2.0** - Main framework
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - Database operations
- **H2 Database** - In-memory database for development
- **JWT** - Token-based authentication
- **RazorPay** - Payment gateway integration
- **Maven** - Dependency management

### Frontend
- **React 18** - User interface
- **Material-UI** - Component library
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Axios** - HTTP client

## 🚀 Quick Start

### Prerequisites
- Java 21+
- Node.js 18+
- Maven 3.6+

### Backend Setup
```bash
cd backend
mvn clean compile
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

The frontend will start on `http://localhost:3000`

## 📊 Sample Data

The application comes with pre-loaded sample data:

### Users
- **Email:** user@example.com
- **Password:** password

### Restaurant
- **Name:** Delicious Food Restaurant
- **Cuisine:** American
- **Rating:** 4.5/5
- **Delivery Time:** 30 minutes

### Menu Items
- Chicken Wings ($12.99)
- Grilled Chicken ($15.99)
- Chocolate Cake ($8.99)
- Caesar Salad ($10.99)

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Restaurants
- `GET /api/restaurants` - List all restaurants
- `GET /api/restaurants/{id}` - Get restaurant details
- `GET /api/restaurants/search?q={query}` - Search restaurants
- `GET /api/restaurants/cuisine/{cuisine}` - Filter by cuisine

### Menu Items
- `GET /api/menu-items/restaurant/{restaurantId}` - Get restaurant menu
- `GET /api/menu-items/{id}` - Get menu item details

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/user` - Get user orders
- `GET /api/orders/{id}` - Get order details

### Payments
- `POST /api/payments/create-order/{orderId}` - Create payment order
- `POST /api/payments/verify` - Verify payment

## 🏗️ Project Structure

```
food-delivery/
├── backend/
│   ├── src/main/java/com/fooddelivery/
│   │   ├── entity/          # JPA entities
│   │   ├── repository/      # Data access layer
│   │   ├── service/         # Business logic
│   │   ├── controller/      # REST controllers
│   │   ├── dto/            # Data transfer objects
│   │   ├── config/         # Configuration classes
│   │   └── security/       # Security configuration
│   └── src/main/resources/
│       └── application.properties
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Redux store and slices
│   │   └── App.js          # Main application
│   └── package.json
└── README.md
```

## 🧪 Testing

Run the comprehensive test suite:

```bash
chmod +x test_complete_app.sh
./test_complete_app.sh
```

This will test:
- Backend API connectivity
- Authentication endpoints
- Restaurant and menu data
- Frontend accessibility

## 🎯 Key Features Demonstrated

1. **Full-Stack Integration** - Complete backend-frontend communication
2. **Real-time State Management** - Redux for cart and user state
3. **Responsive Design** - Material-UI components for all screen sizes
4. **Security** - JWT authentication and role-based access
5. **Database Integration** - H2 with sample data
6. **Payment Processing** - RazorPay integration ready
7. **Order Tracking** - Complete order lifecycle management

## 🔧 Configuration

### Backend Configuration
Edit `backend/src/main/resources/application.properties`:
- Database connection settings
- JWT secret and expiration
- RazorPay API keys
- CORS configuration

### Frontend Configuration
Edit API base URL in Redux slices:
- Default: `http://localhost:8080/api`
- Update for production deployment

## 🚀 Deployment

### Backend Deployment
1. Build the JAR: `mvn clean package`
2. Run: `java -jar target/food-delivery-backend-1.0.0.jar`

### Frontend Deployment
1. Build: `npm run build`
2. Deploy the `build` folder to your web server

## 📝 License

This project is for educational purposes and demonstrates full-stack development with modern technologies.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

**🎉 The Food Delivery Application is now fully functional and ready for use!**
