import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Box,
  TextField,
  InputAdornment,
  Chip,
  Rating,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  AccessTime as TimeIcon,
  LocalShipping as DeliveryIcon,
} from '@mui/icons-material';
import { fetchRestaurants, searchRestaurants } from '../store/slices/restaurantSlice';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { restaurants, loading, error } = useSelector((state) => state.restaurant);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch(searchRestaurants(searchQuery));
    } else {
      dispatch(fetchRestaurants());
    }
  };

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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Discover Amazing Restaurants
      </Typography>
      
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
        Order delicious food from the best restaurants in your area
      </Typography>

      <Box component="form" onSubmit={handleSearch} sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search restaurants or cuisines..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Button type="submit" variant="contained" sx={{ ml: 1 }}>
                  Search
                </Button>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {restaurants.map((restaurant) => (
          <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
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
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  {restaurant.name}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {restaurant.description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={restaurant.rating} precision={0.5} size="small" readOnly />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    ({restaurant.reviewCount} reviews)
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TimeIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {restaurant.deliveryTime} min
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <DeliveryIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
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
              
              <CardActions>
                <Button 
                  size="small" 
                  variant="contained" 
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRestaurantClick(restaurant.id);
                  }}
                >
                  View Menu
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {restaurants.length === 0 && !loading && !error && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No restaurants found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search criteria
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Home;