import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
  Chip,
  Rating,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  AccessTime as TimeIcon,
  LocalShipping as DeliveryIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';
import { fetchRestaurantById } from '../store/slices/restaurantSlice';
import { addToCart, updateQuantity } from '../store/slices/cartSlice';
import axios from 'axios';

const RestaurantDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentRestaurant, loading, error } = useSelector((state) => state.restaurant);
  const { items } = useSelector((state) => state.cart);
  
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [menuLoading, setMenuLoading] = useState(false);
  const [vegOnly, setVegOnly] = useState(false);
  const [spicyOnly, setSpicyOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(0);

  useEffect(() => {
    dispatch(fetchRestaurantById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (!currentRestaurant) return;
    fetchMenuItems();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRestaurant]);

  const fetchMenuItems = async () => {
    setMenuLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/menu-items/restaurant/${id}`);
      setMenuItems(response.data);
    } catch (error) {
      console.error('Failed to fetch menu items:', error);
    } finally {
      setMenuLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleAddToCart = (item) => {
    dispatch(addToCart({
      item,
      restaurantId: currentRestaurant.id,
    }));
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity >= 0) {
      dispatch(updateQuantity({ itemId, quantity: newQuantity }));
    }
  };

  const getCartItemQuantity = (itemId) => {
    const cartItem = items.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const filteredMenuItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || 
      (item.categoryName && item.categoryName.toLowerCase() === selectedCategory.toLowerCase());
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const vegOk = !vegOnly || item.isVegetarian;
    const spicyOk = !spicyOnly || item.isSpicy;
    const priceOk = !maxPrice || (item.price || 0) <= maxPrice;
    return matchesCategory && matchesSearch && vegOk && spicyOk && priceOk;
  });

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
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Restaurant Header */}
      <Card sx={{ mb: 4 }}>
        <Box sx={{ borderTopLeftRadius: 12, borderTopRightRadius: 12, overflow: 'hidden' }}>
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop
          >
            {[
              currentRestaurant.imageUrl || 'https://via.placeholder.com/800x300?text=Restaurant',
              'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1600&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1600&auto=format&fit=crop',
            ].map((src, idx) => (
              <SwiperSlide key={idx}>
                <Box
                  component="img"
                  src={src}
                  alt={currentRestaurant.name}
                  sx={{ width: '100%', height: 300, objectFit: 'cover' }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            {currentRestaurant.name}
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {currentRestaurant.description}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={currentRestaurant.rating} precision={0.5} readOnly />
            <Typography variant="body2" sx={{ ml: 1 }}>
              ({currentRestaurant.reviewCount} reviews)
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TimeIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {currentRestaurant.deliveryTime} min delivery
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <DeliveryIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                ₹{currentRestaurant.deliveryFee} delivery fee
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

      {/* Search and Filter */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search menu items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        <Tabs
          value={selectedCategory}
          onChange={(e, newValue) => setSelectedCategory(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="All" value="all" />
          {categories.map((category) => (
            <Tab key={category.id} label={category.name} value={category.name} />
          ))}
        </Tabs>
        <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
          <Chip
            label={vegOnly ? 'Veg Only: ON' : 'Veg Only: OFF'}
            color={vegOnly ? 'success' : 'default'}
            variant={vegOnly ? 'filled' : 'outlined'}
            onClick={() => setVegOnly((v) => !v)}
          />
          <Chip
            label={spicyOnly ? 'Spicy Only: ON' : 'Spicy Only: OFF'}
            color={spicyOnly ? 'error' : 'default'}
            variant={spicyOnly ? 'filled' : 'outlined'}
            onClick={() => setSpicyOnly((v) => !v)}
          />
          <TextField
            type="number"
            label="Max Price"
            size="small"
            inputProps={{ min: 0, step: 1 }}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </Box>
      </Box>

      {/* Menu Items */}
      {menuLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredMenuItems.map((item) => {
            const cartQuantity = getCartItemQuantity(item.id);
            
            return (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.imageUrl || 'https://via.placeholder.com/400x200?text=Food'}
                    alt={item.name}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {item.name}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {item.description}
                    </Typography>

                    <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                      ₹{item.price}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      {item.isVegetarian && (
                        <Chip label="Vegetarian" size="small" color="success" variant="outlined" />
                      )}
                      {item.isSpicy && (
                        <Chip label="Spicy" size="small" color="error" variant="outlined" />
                      )}
                    </Box>
                  </CardContent>
                  
                  <CardActions>
                    {cartQuantity === 0 ? (
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleAddToCart(item)}
                      >
                        Add to Cart
                      </Button>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleQuantityChange(item.id, cartQuantity - 1)}
                        >
                          <RemoveIcon />
                        </Button>
                        
                        <Typography variant="body1" sx={{ flex: 1, textAlign: 'center' }}>
                          {cartQuantity}
                        </Typography>
                        
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleQuantityChange(item.id, cartQuantity + 1)}
                        >
                          <AddIcon />
                        </Button>
                      </Box>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {filteredMenuItems.length === 0 && !menuLoading && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No menu items found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search or filter criteria
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default RestaurantDetail;