# Food Delivery Application

A full-stack food delivery platform built with Spring Boot, React, MySQL, and RazorPay integration.

## Features

- **User Management**: Registration, login, profile management
- **Restaurant Management**: Browse restaurants, view menus, categories
- **Menu Browsing**: Search, filter, and browse food items
- **Cart Management**: Add/remove items, quantity management
- **Order Management**: Place orders, track delivery status
- **Payment Integration**: Secure payments with RazorPay
- **Delivery Tracking**: Real-time order status updates
- **Admin Panel**: Restaurant and order management

## Tech Stack

### Backend
- **Spring Boot 3.x**: RESTful APIs
- **Spring Security**: Authentication & Authorization
- **Spring Data JPA**: Database operations
- **MySQL**: Database
- **RazorPay**: Payment gateway
- **JWT**: Token-based authentication

### Frontend
- **React 18**: User interface
- **Material-UI**: Component library
- **Redux Toolkit**: State management
- **Axios**: HTTP client
- **React Router**: Navigation

## Project Structure

```
food-delivery-app/
├── backend/                 # Spring Boot application
│   ├── src/
│   ├── pom.xml
│   └── application.properties
├── frontend/               # React application
│   ├── src/
│   ├── package.json
│   └── public/
└── database/              # SQL scripts
    └── schema.sql
```

## Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8.0+
- Maven

### Backend Setup
1. Navigate to `backend/`
2. Configure database in `application.properties`
3. Run: `mvn spring-boot:run`

### Frontend Setup
1. Navigate to `frontend/`
2. Install dependencies: `npm install`
3. Run: `npm start`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Restaurants
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/{id}` - Get restaurant details
- `GET /api/restaurants/{id}/menu` - Get restaurant menu

### Orders
- `POST /api/orders` - Place order
- `GET /api/orders` - Get user orders
- `GET /api/orders/{id}` - Get order details
- `PUT /api/orders/{id}/status` - Update order status

### Payments
- `POST /api/payments/create-order` - Create RazorPay order
- `POST /api/payments/verify` - Verify payment

## Database Schema

The application uses MySQL with the following main entities:
- Users
- Restaurants
- Menu Items
- Categories
- Orders
- Order Items
- Payments
- Delivery Status

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
