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
import { fetchRestaurantsPage, searchRestaurants } from '../store/slices/restaurantSlice';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { restaurants, loading, error, page, hasMore, appending } = useSelector((state) => state.restaurant);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ cuisine: 'all', minRating: 0, maxDeliveryTime: 0 });

  useEffect(() => {
    dispatch(fetchRestaurantsPage({ page: 0, size: 9 }));
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch(searchRestaurants(searchQuery));
    } else {
      dispatch(fetchRestaurantsPage({ page: 0, size: 9 }));
    }
  };

  const handleRestaurantClick = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}`);
  };

  if (loading && restaurants.length === 0) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const cuisineOk = filters.cuisine === 'all' || (restaurant.cuisine || '').toLowerCase() === filters.cuisine.toLowerCase();
    const ratingOk = !filters.minRating || (restaurant.rating || 0) >= filters.minRating;
    const timeOk = !filters.maxDeliveryTime || (restaurant.deliveryTime || 0) <= filters.maxDeliveryTime;
    return cuisineOk && ratingOk && timeOk;
  });

  const handleLoadMore = () => {
    if (hasMore && !appending) {
      dispatch(fetchRestaurantsPage({ page: page + 1, size: 9 }));
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
          style={{ borderRadius: 12, overflow: 'hidden' }}
        >
          {[
            'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600&auto=format&fit=crop',
          ].map((src, idx) => (
            <SwiperSlide key={idx}>
              <Box
                sx={{
                  position: 'relative',
                  height: { xs: 200, sm: 280, md: 340 },
                  backgroundImage: `url(${src})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.4), rgba(0,0,0,0.25))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    color: '#fff',
                    px: 2,
                  }}
                >
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      Discover Amazing Restaurants
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9, mt: 1 }}>
                      Order delicious food from the best restaurants in your area
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      <Box component="form" onSubmit={handleSearch} sx={{ mb: 2 }}>
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

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            select
            fullWidth
            label="Cuisine"
            SelectProps={{ native: true }}
            value={filters.cuisine}
            onChange={(e) => setFilters((f) => ({ ...f, cuisine: e.target.value }))}
          >
            <option value="all">All</option>
            <option value="American">American</option>
            <option value="Indian">Indian</option>
            <option value="Italian">Italian</option>
          </TextField>
        </Grid>
        <Grid item xs={6} sm={4}>
          <TextField
            type="number"
            label="Min Rating"
            fullWidth
            inputProps={{ min: 0, max: 5, step: 0.5 }}
            value={filters.minRating}
            onChange={(e) => setFilters((f) => ({ ...f, minRating: Number(e.target.value) }))}
          />
        </Grid>
        <Grid item xs={6} sm={4}>
          <TextField
            type="number"
            label="Max Delivery Time (min)"
            fullWidth
            inputProps={{ min: 0, max: 120, step: 5 }}
            value={filters.maxDeliveryTime}
            onChange={(e) => setFilters((f) => ({ ...f, maxDeliveryTime: Number(e.target.value) }))}
          />
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {filteredRestaurants.map((restaurant) => (
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
                    ₹{restaurant.deliveryFee} delivery fee
                  </Typography>
                </Box>

                <Chip label={restaurant.cuisine} size="small" color="primary" variant="outlined" />
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

      {filteredRestaurants.length === 0 && !loading && !error && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No restaurants found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search criteria
          </Typography>
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button variant="outlined" onClick={handleLoadMore} disabled={!hasMore || appending}>
          {appending ? 'Loading...' : hasMore ? 'Load More' : 'No More Results'}
        </Button>
      </Box>
    </Container>
  );
};

export default Home;