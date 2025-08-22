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
import axios from 'axios';

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
  const [paymentMethod, setPaymentMethod] = useState('CASH_ON_DELIVERY');
  const [orderError, setOrderError] = useState('');
  const [errors, setErrors] = useState({ address: '', phone: '' });

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart(itemId));
    } else {
      dispatch(updateQuantity({ itemId, quantity: newQuantity }));
    }
  };

  const validateFields = () => {
    const newErrors = { address: '', phone: '' };
    if (!deliveryAddress.trim()) {
      newErrors.address = 'Please enter your full delivery address.';
    } else if (deliveryAddress.trim().length < 10) {
      newErrors.address = 'Address should be at least 10 characters.';
    }
    if (!deliveryPhone.trim()) {
      newErrors.phone = 'Please enter your phone number.';
    } else if (!/^\d{10}$/.test(deliveryPhone.trim())) {
      newErrors.phone = 'Phone number must be 10 digits.';
    }
    setErrors(newErrors);
    return !newErrors.address && !newErrors.phone;
  };

  const handlePlaceOrder = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!validateFields()) {
      setOrderError('Please fix the highlighted fields.');
      return;
    }
    setOrderError('');
    setShowOrderDialog(true);
  };

  const handleConfirmOrder = async () => {
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
      paymentMethod,
    };
    try {
      const created = await dispatch(createOrder(orderData)).unwrap();
      // If online payment, create Razorpay order and open checkout
      if (paymentMethod === 'ONLINE' && created?.id) {
        const token = localStorage.getItem('token');
        const base = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';
        const paymentRes = await axios.post(`${base}/payments/create-order/${created.id}`, {}, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        const { razorpayOrderId, amount, keyId } = paymentRes.data || {};

        const options = {
          key: keyId,
          amount: Math.round((amount || 0) * 100),
          currency: 'INR',
          name: 'Food Delivery',
          description: `Order #${created.orderNumber}`,
          order_id: razorpayOrderId,
          handler: async function (response) {
            try {
              const base = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';
              await axios.post(`${base}/payments/verify`, {
                orderId: created.id,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                paymentMethod: 'ONLINE'
              }, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
              dispatch(clearCart());
              setShowOrderDialog(false);
              navigate(`/orders/${created.id}`);
            } catch (e) {
              setOrderError('Payment verification failed');
            }
          },
          prefill: {
            contact: deliveryPhone,
          },
          theme: { color: '#ff6b35' },
        };
        if (window.Razorpay) {
          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          setOrderError('Payment SDK not loaded');
        }
      } else {
        // COD flow
        dispatch(clearCart());
        setShowOrderDialog(false);
        navigate(created?.id ? `/orders/${created.id}` : '/orders');
      }
    } catch (error) {
      setOrderError(error?.message || 'Failed to place order');
    }
  };

  const isPlaceOrderDisabled = loading || items.length === 0 || !deliveryAddress.trim() || !/^\d{10}$/.test(deliveryPhone.trim());

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
                  onBlur={validateFields}
                  margin="normal"
                  required
                  placeholder="Enter your delivery address"
                  error={!!errors.address}
                  helperText={errors.address}
                />
                
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={deliveryPhone}
                  onChange={(e) => setDeliveryPhone(e.target.value)}
                  onBlur={validateFields}
                  margin="normal"
                  required
                  placeholder="1234567890"
                  error={!!errors.phone}
                  helperText={errors.phone}
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
                disabled={isPlaceOrderDisabled}
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Place Order'}
              </Button>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Button variant={paymentMethod === 'CASH_ON_DELIVERY' ? 'contained' : 'outlined'} onClick={() => setPaymentMethod('CASH_ON_DELIVERY')} fullWidth>
                  Cash on Delivery
                </Button>
                <Button variant={paymentMethod === 'ONLINE' ? 'contained' : 'outlined'} onClick={() => setPaymentMethod('ONLINE')} fullWidth>
                  Pay Online
                </Button>
              </Box>
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