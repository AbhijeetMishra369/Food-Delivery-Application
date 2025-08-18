import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon, ShoppingCart as CartIcon } from '@mui/icons-material';
import { updateQuantity, removeFromCart, clearCart } from '../store/slices/cartSlice';
import { createOrder } from '../store/slices/orderSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total, restaurantId } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.order);
  
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryPhone, setDeliveryPhone] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [orderError, setOrderError] = useState('');

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart(itemId));
    } else {
      dispatch(updateQuantity({ itemId, quantity: newQuantity }));
    }
  };

  const handlePlaceOrder = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!deliveryAddress.trim() || !deliveryPhone.trim()) {
      setOrderError('Please fill in all required fields');
      return;
    }

    setOrderError('');
    setShowOrderDialog(true);
  };

  const handleConfirmOrder = () => {
    const orderData = {
      restaurantId,
      items: items.map(item => ({
        menuItemId: item.id,
        quantity: item.quantity,
        specialInstructions: '',
      })),
      deliveryAddress,
      deliveryPhone,
      deliveryInstructions,
      paymentMethod: 'CASH_ON_DELIVERY',
    };

    dispatch(createOrder(orderData))
      .unwrap()
      .then(() => {
        dispatch(clearCart());
        setShowOrderDialog(false);
        navigate('/orders');
      })
      .catch((error) => {
        setOrderError(error || 'Failed to place order');
      });
  };

  if (items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <CartIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Add some delicious items to get started!
          </Typography>
          <Button variant="contained" onClick={() => navigate('/')}>
            Browse Restaurants
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Your Cart
      </Typography>

      <Grid container spacing={3}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Cart Items ({items.length})
              </Typography>
              
              {items.map((item) => (
                <Box key={item.id} sx={{ mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={3}>
                      <img
                        src={item.imageUrl || 'https://via.placeholder.com/100x100?text=Food'}
                        alt={item.name}
                        style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                      />
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="h6">{item.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        ₹{item.price} each
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        >
                          <RemoveIcon />
                        </IconButton>
                        
                        <Typography variant="body1" sx={{ mx: 1, minWidth: '20px', textAlign: 'center' }}>
                          {item.quantity}
                        </Typography>
                        
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>
                      
                      <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </Grid>
                  </Grid>
                  
                  <Divider sx={{ mt: 2 }} />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Delivery Address"
                  multiline
                  rows={3}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  margin="normal"
                  required
                  placeholder="Enter your delivery address"
                />
                
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={deliveryPhone}
                  onChange={(e) => setDeliveryPhone(e.target.value)}
                  margin="normal"
                  required
                  placeholder="1234567890"
                />
                
                <TextField
                  fullWidth
                  label="Delivery Instructions (Optional)"
                  multiline
                  rows={2}
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                  margin="normal"
                  placeholder="Any special instructions for delivery"
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="body1">
                  Subtotal: ₹{total.toFixed(2)}
                </Typography>
                <Typography variant="body1">
                  Delivery Fee: ₹5.00
                </Typography>
                <Typography variant="body1">
                  Tax: ₹{(total * 0.1).toFixed(2)}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" color="primary">
                Total: ₹{(total + 5 + total * 0.1).toFixed(2)}
              </Typography>

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handlePlaceOrder}
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Place Order'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Order Confirmation Dialog */}
      <Dialog open={showOrderDialog} onClose={() => setShowOrderDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm Order</DialogTitle>
        <DialogContent>
          {orderError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {orderError}
            </Alert>
          )}
          
          <Typography variant="body1" gutterBottom>
            Are you sure you want to place this order?
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Delivery Address:</strong> {deliveryAddress}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Phone:</strong> {deliveryPhone}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Total:</strong> ₹{(total + 5 + total * 0.1).toFixed(2)}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowOrderDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmOrder} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Confirm Order'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Cart;