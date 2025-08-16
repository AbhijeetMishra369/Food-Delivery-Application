import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Rating,
  Chip,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  TextField,
} from '@mui/material';
import { Add, Remove, LocalShipping, AccessTime, Star } from '@mui/icons-material';
import { fetchRestaurantById, fetchMenuItems } from '../store/slices/restaurantSlice';
import { addToCart } from '../store/slices/cartSlice';

const RestaurantDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { currentRestaurant, menuItems, loading, error } = useSelector((state) => state.restaurant);
  
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    dispatch(fetchRestaurantById(id));
    dispatch(fetchMenuItems(id));
  }, [dispatch, id]);

  const handleAddToCart = (item) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    dispatch(addToCart({
      item,
      restaurantId: currentRestaurant.id,
      restaurantName: currentRestaurant.name,
    }));
  };

  const handleQuantityChange = (itemId, change) => {
    const currentQty = quantities[itemId] || 0;
    const newQty = Math.max(0, currentQty + change);
    
    if (newQty === 0) {
      const newQuantities = { ...quantities };
      delete newQuantities[itemId];
      setQuantities(newQuantities);
    } else {
      setQuantities(prev => ({
        ...prev,
        [itemId]: newQty,
      }));
    }
  };

  const handleAddMultipleToCart = (item) => {
    const quantity = quantities[item.id] || 1;
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart({
        item,
        restaurantId: currentRestaurant.id,
        restaurantName: currentRestaurant.name,
      }));
    }
    // Clear quantity after adding
    const newQuantities = { ...quantities };
    delete newQuantities[item.id];
    setQuantities(newQuantities);
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!currentRestaurant) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="info">Restaurant not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Restaurant Header */}
      <Card sx={{ mb: 4 }}>
        <CardMedia
          component="img"
          height="300"
          image={currentRestaurant.imageUrl || 'https://via.placeholder.com/800x300?text=Restaurant'}
          alt={currentRestaurant.name}
        />
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            {currentRestaurant.name}
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            {currentRestaurant.description}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating 
              value={currentRestaurant.rating} 
              readOnly 
              icon={<Star />}
            />
            <Typography variant="body2" sx={{ ml: 1 }}>
              ({currentRestaurant.reviewCount} reviews)
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTime sx={{ mr: 0.5 }} />
              <Typography variant="body2">
                {currentRestaurant.deliveryTime} min delivery
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocalShipping sx={{ mr: 0.5 }} />
              <Typography variant="body2">
                ${currentRestaurant.deliveryFee} delivery fee
              </Typography>
            </Box>
          </Box>
          
          <Chip 
            label={currentRestaurant.cuisine} 
            color="primary" 
            variant="outlined"
          />
        </CardContent>
      </Card>

      {/* Menu Items */}
      <Typography variant="h5" component="h2" gutterBottom>
        Menu
      </Typography>
      
      <Grid container spacing={3}>
        {menuItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={item.imageUrl || 'https://via.placeholder.com/400x200?text=Food'}
                alt={item.name}
              />
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" component="h3" gutterBottom>
                  {item.name}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" paragraph sx={{ flexGrow: 1 }}>
                  {item.description}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" color="primary" sx={{ mr: 1 }}>
                    ${item.price}
                  </Typography>
                  {item.isVegetarian && (
                    <Chip label="Vegetarian" size="small" color="success" sx={{ mr: 0.5 }} />
                  )}
                  {item.isSpicy && (
                    <Chip label="Spicy" size="small" color="error" />
                  )}
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton 
                      size="small" 
                      onClick={() => handleQuantityChange(item.id, -1)}
                    >
                      <Remove />
                    </IconButton>
                    <TextField
                      size="small"
                      value={quantities[item.id] || 0}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        if (value === 0) {
                          const newQuantities = { ...quantities };
                          delete newQuantities[item.id];
                          setQuantities(newQuantities);
                        } else {
                          setQuantities(prev => ({
                            ...prev,
                            [item.id]: value,
                          }));
                        }
                      }}
                      sx={{ width: 60, mx: 1 }}
                      inputProps={{ min: 0, style: { textAlign: 'center' } }}
                    />
                    <IconButton 
                      size="small" 
                      onClick={() => handleQuantityChange(item.id, 1)}
                    >
                      <Add />
                    </IconButton>
                  </Box>
                  
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Add />}
                    onClick={() => {
                      if (quantities[item.id] && quantities[item.id] > 0) {
                        handleAddMultipleToCart(item);
                      } else {
                        handleAddToCart(item);
                      }
                    }}
                  >
                    Add
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {menuItems.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No menu items available.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default RestaurantDetail;