#!/bin/bash

echo "Testing Food Delivery Backend..."

# Test if backend is running
if curl -s http://localhost:8080/api/restaurants > /dev/null; then
    echo "✅ Backend is running and responding"
    
    # Test restaurants endpoint
    echo "Testing restaurants endpoint..."
    curl -s http://localhost:8080/api/restaurants | jq .
    
    # Test authentication
    echo "Testing authentication..."
    curl -X POST http://localhost:8080/api/auth/login \
        -H "Content-Type: application/json" \
        -d '{"email":"user@example.com","password":"password"}' | jq .
        
else
    echo "❌ Backend is not running"
    echo "Starting backend..."
    cd backend && mvn spring-boot:run &
    sleep 30
    
    if curl -s http://localhost:8080/api/restaurants > /dev/null; then
        echo "✅ Backend started successfully"
    else
        echo "❌ Failed to start backend"
    fi
fi