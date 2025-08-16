import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Rating,
  Chip,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { LocalShipping, AccessTime, Star } from '@mui/icons-material';
import { fetchRestaurants } from '../store/slices/restaurantSlice';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { restaurants, loading, error } = useSelector((state) => state.restaurant);

  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);

  const handleRestaurantClick = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}`);
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Discover Amazing Restaurants
      </Typography>
      
      <Grid container spacing={3}>
        {restaurants.map((restaurant) => (
          <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
            <Card 
              sx={{ 
                height: '100%', 
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
              onClick={() => handleRestaurantClick(restaurant.id)}
            >
              <CardMedia
                component="img"
                height="200"
                image={restaurant.imageUrl || 'https://via.placeholder.com/400x200?text=Restaurant'}
                alt={restaurant.name}
              />
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  {restaurant.name}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  {restaurant.description}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating 
                    value={restaurant.rating} 
                    readOnly 
                    size="small"
                    icon={<Star />}
                  />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    ({restaurant.reviewCount} reviews)
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AccessTime sx={{ fontSize: 16, mr: 0.5 }} />
                  <Typography variant="body2">
                    {restaurant.deliveryTime} min
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocalShipping sx={{ fontSize: 16, mr: 0.5 }} />
                  <Typography variant="body2">
                    ${restaurant.deliveryFee} delivery fee
                  </Typography>
                </Box>
                
                <Chip 
                  label={restaurant.cuisine} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {restaurants.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No restaurants available at the moment.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Home;