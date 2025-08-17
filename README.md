# 🍕 Food Delivery Application

A complete, full-stack food delivery application built with Spring Boot (Backend) and React (Frontend), featuring modern UI/UX, comprehensive functionality, and robust testing.

## 🚀 Features

### 🔐 Authentication & Security
- User registration and login with JWT tokens
- Password encryption and validation
- Role-based access control
- Secure API endpoints

### 🏪 Restaurant Management
- Browse restaurants with search functionality
- View restaurant details, ratings, and reviews
- Filter restaurants by cuisine type
- Real-time availability status

### 🍽️ Menu & Ordering System
- Browse menu items by category
- Search menu items
- Add items to cart with quantity management
- Special instructions for orders
- Restaurant-specific shopping cart

### 🛒 Shopping Cart
- Add/remove items with real-time updates
- Quantity management
- Cart persistence across sessions
- Restaurant-specific cart (one restaurant at a time)

### 📦 Order Management
- Place orders with delivery details
- Order confirmation with dialog
- Order tracking with visual progress stepper
- Order history and details
- Payment integration (RazorPay)

### 🎨 Modern UI/UX
- Responsive design for all screen sizes
- Material-UI components
- Intuitive navigation
- Loading states and error handling
- Form validation with real-time feedback

## 🛠️ Technology Stack

### Backend (Spring Boot 3.2.0)
- **Framework**: Spring Boot 3.2.0
- **Security**: Spring Security with JWT
- **Database**: MySQL 8.0
- **ORM**: Spring Data JPA with Hibernate
- **Validation**: Bean Validation
- **Payment**: RazorPay integration
- **Build Tool**: Maven

### Frontend (React 18)
- **Framework**: React 18 with Hooks
- **UI Library**: Material-UI (MUI)
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Build Tool**: npm

## 📁 Project Structure

```
food-delivery-app/
├── backend/                          # Spring Boot Backend
│   ├── src/main/java/com/fooddelivery/
│   │   ├── config/                   # Configuration classes
│   │   ├── controller/               # REST controllers
│   │   ├── dto/                      # Data Transfer Objects
│   │   ├── entity/                   # JPA entities
│   │   ├── repository/               # Data repositories
│   │   ├── security/                 # Security configuration
│   │   └── service/                  # Business logic
│   ├── src/main/resources/
│   │   └── application.properties    # Application configuration
│   └── pom.xml                       # Maven dependencies
├── frontend/                         # React Frontend
│   ├── src/
│   │   ├── components/               # Reusable components
│   │   ├── pages/                    # Page components
│   │   ├── store/                    # Redux store and slices
│   │   └── App.js                    # Main app component
│   ├── package.json                  # npm dependencies
│   └── public/                       # Static files
├── test_complete_app.sh              # Comprehensive test script
├── demo.sh                           # Demo and showcase script
└── README.md                         # This file
```

## 🚀 Quick Start

### Prerequisites
- Java 21 or higher
- Node.js 16 or higher
- npm or yarn
- MySQL 8.0 or higher

### 1. Clone and Setup
```bash
# Navigate to the project directory
cd food-delivery-app

# Make scripts executable
chmod +x test_complete_app.sh demo.sh
```

### 2. Setup MySQL Database
```bash
# Start MySQL service
sudo systemctl start mysql

# Create database (optional - will be created automatically)
mysql -u root -p < setup_mysql.sql

# Or manually create database
mysql -u root -p
CREATE DATABASE food_delivery;
```

### 3. Start Backend
```bash
cd backend
mvn spring-boot:run
```
The backend will start on `http://localhost:8080`

### 4. Start Frontend
```bash
cd frontend
npm install
npm start
```
The frontend will start on `http://localhost:3000`

### 5. Run Tests
```bash
# Run comprehensive tests
./test_complete_app.sh

# Or run the demo
./demo.sh
```

## 🧪 Testing

### Automated Testing
The application includes comprehensive test scripts:

- **`test_complete_app.sh`**: Tests all backend API endpoints and frontend functionality
- **`demo.sh`**: Provides a detailed demonstration and testing guide

### Manual Testing
1. Open `http://localhost:3000` in your browser
2. Register a new account or login with test credentials
3. Browse restaurants and add items to cart
4. Place an order and track its status
5. View order history and details

### Test Credentials
- **Email**: `user@example.com`
- **Password**: `password`

## 📊 Sample Data

The application comes with pre-loaded sample data:

### Restaurants
- **Delicious Food Restaurant**
  - Cuisine: International
  - Rating: 4.5/5
  - Delivery Time: 30-45 minutes

### Menu Items
- **Appetizers**: Chicken Wings, Caesar Salad
- **Main Courses**: Grilled Chicken, Beef Burger
- **Desserts**: Chocolate Cake, Ice Cream
- **Beverages**: Soft Drinks, Coffee

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Restaurants
- `GET /api/restaurants` - List all restaurants
- `GET /api/restaurants/{id}` - Get restaurant details
- `GET /api/restaurants/search?q={query}` - Search restaurants

### Menu Items
- `GET /api/menu-items/restaurant/{id}` - Get restaurant menu
- `GET /api/menu-items/category/{categoryId}` - Get items by category
- `GET /api/categories` - List all categories

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/user` - Get user orders
- `GET /api/orders/{id}` - Get order details

## 🎯 Key Features

### Backend Features
- ✅ RESTful API design
- ✅ JWT authentication
- ✅ Spring Security
- ✅ H2 in-memory database
- ✅ JPA/Hibernate ORM
- ✅ Input validation
- ✅ CORS configuration
- ✅ RazorPay payment integration
- ✅ Sample data initialization

### Frontend Features
- ✅ Modern React 18 with hooks
- ✅ Material-UI components
- ✅ Redux Toolkit for state management
- ✅ React Router for navigation
- ✅ Axios for API calls
- ✅ Responsive design
- ✅ Form validation
- ✅ Loading states and error handling

### Database Schema
- ✅ Users (authentication & profiles)
- ✅ Restaurants (details & ratings)
- ✅ Categories (menu organization)
- ✅ Menu Items (food items & prices)
- ✅ Orders (order management)
- ✅ Order Items (order details)
- ✅ Payments (payment tracking)

## 🔧 Configuration

### Backend Configuration (`application.properties`)
```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/food_delivery?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.driverClassName=com.mysql.cj.jdbc.Driver
spring.datasource.username=root
spring.datasource.password=password

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# Security
jwt.secret=your-secret-key
jwt.expiration=86400000

# CORS
spring.web.cors.allowed-origins=http://localhost:3000
```

### Frontend Configuration
- API base URL: `http://localhost:8080/api`
- Proxy configuration in `package.json`

## 🐛 Troubleshooting

### Common Issues

1. **Backend won't start**
   - Check if port 8080 is available
   - Ensure Java 21+ is installed
   - Check Maven dependencies

2. **Frontend won't start**
   - Check if port 3000 is available
   - Ensure Node.js 16+ is installed
   - Run `npm install` to install dependencies

3. **CORS errors**
   - Ensure backend is running on port 8080
   - Check CORS configuration in `application.properties`

4. **Database issues**
   - Ensure MySQL is running: `sudo systemctl status mysql`
   - Check database connection: `mysql -u root -p -e "USE food_delivery; SHOW TABLES;"`
   - Database persists data between restarts

### Debug Mode
```bash
# Backend with debug logging
cd backend
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Dlogging.level.com.fooddelivery=DEBUG"

# Frontend with debug mode
cd frontend
npm start
```

## 📈 Performance

### Backend Performance
- H2 in-memory database for fast development
- JPA/Hibernate for efficient data access
- JWT tokens for stateless authentication
- Optimized queries with proper indexing

### Frontend Performance
- React 18 with concurrent features
- Redux Toolkit for efficient state management
- Material-UI for optimized rendering
- Lazy loading and code splitting ready

## 🔒 Security

### Authentication
- JWT-based authentication
- Password encryption with BCrypt
- Token expiration and refresh
- Role-based access control

### API Security
- Spring Security configuration
- CORS protection
- Input validation and sanitization
- SQL injection prevention

## 🚀 Deployment

### Backend Deployment
```bash
# Build JAR file
cd backend
mvn clean package

# Run JAR file
java -jar target/food-delivery-0.0.1-SNAPSHOT.jar
```

### Frontend Deployment
```bash
# Build production files
cd frontend
npm run build

# Serve static files
npx serve -s build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React team for the amazing frontend library
- Material-UI team for the beautiful components
- Redux Toolkit team for the state management solution

## 📞 Support

For support and questions:
- Check the troubleshooting section
- Review the API documentation
- Run the test scripts for verification
- Check the demo script for usage examples

---

**🎉 Enjoy your Food Delivery Application!**
