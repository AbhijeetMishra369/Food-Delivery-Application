import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Chip,
  Grid,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Divider,
} from '@mui/material';
import {
  AccessTime as TimeIcon,
  LocalShipping as DeliveryIcon,
  Receipt as ReceiptIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { fetchOrderById } from '../store/slices/orderSlice';

const OrderDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentOrder, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchOrderById(id));
  }, [dispatch, id]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'CONFIRMED':
        return 'info';
      case 'PREPARING':
        return 'primary';
      case 'READY_FOR_DELIVERY':
        return 'secondary';
      case 'OUT_FOR_DELIVERY':
        return 'info';
      case 'DELIVERED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'COMPLETED':
        return 'success';
      case 'FAILED':
        return 'error';
      case 'REFUNDED':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusStep = (status) => {
    switch (status) {
      case 'PENDING':
        return 0;
      case 'CONFIRMED':
        return 1;
      case 'PREPARING':
        return 2;
      case 'READY_FOR_DELIVERY':
        return 3;
      case 'OUT_FOR_DELIVERY':
        return 4;
      case 'DELIVERED':
        return 5;
      case 'CANCELLED':
        return -1;
      default:
        return 0;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
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

  if (!currentOrder) {
    return null;
  }

  const steps = [
    'Order Placed',
    'Order Confirmed',
    'Preparing',
    'Ready for Delivery',
    'Out for Delivery',
    'Delivered'
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Order Details
      </Typography>

      <Grid container spacing={3}>
        {/* Order Summary */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="h5" gutterBottom>
                    Order #{currentOrder.orderNumber}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {currentOrder.restaurantName}
                  </Typography>
                </Box>
                
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h5" color="primary">
                    ₹{currentOrder.total.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(currentOrder.createdAt)}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Chip
                  label={currentOrder.status.replace('_', ' ')}
                  color={getStatusColor(currentOrder.status)}
                  size="medium"
                  sx={{ mr: 1 }}
                />
                <Chip
                  label={currentOrder.paymentStatus}
                  color={getPaymentStatusColor(currentOrder.paymentStatus)}
                  size="medium"
                />
              </Box>

              {/* Order Progress */}
              {currentOrder.status !== 'CANCELLED' && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Order Progress
                  </Typography>
                  <Stepper activeStep={getStatusStep(currentOrder.status)} alternativeLabel>
                    {steps.map((label) => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Box>
              )}

              {/* Order Items */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Order Items
                </Typography>
                {currentOrder.orderItems.map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Box>
                      <Typography variant="body1">
                        {item.menuItemName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Quantity: {item.quantity}
                      </Typography>
                      {item.specialInstructions && (
                        <Typography variant="body2" color="text.secondary">
                          Note: {item.specialInstructions}
                        </Typography>
                      )}
                    </Box>
                    <Typography variant="body1">
                      ₹{item.totalPrice.toFixed(2)}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Order Summary */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Order Summary
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Subtotal:</Typography>
                  <Typography>₹{currentOrder.subtotal.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Delivery Fee:</Typography>
                  <Typography>₹{currentOrder.deliveryFee.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Tax:</Typography>
                  <Typography>₹{currentOrder.tax.toFixed(2)}</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">Total:</Typography>
                  <Typography variant="h6">₹{currentOrder.total.toFixed(2)}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Delivery Information */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Delivery Information
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Address:</strong>
                </Typography>
                <Typography variant="body1">
                  {currentOrder.deliveryAddress}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Phone:</strong>
                </Typography>
                <Typography variant="body1">
                  {currentOrder.deliveryPhone}
                </Typography>
              </Box>
              
              {currentOrder.deliveryInstructions && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Instructions:</strong>
                  </Typography>
                  <Typography variant="body1">
                    {currentOrder.deliveryInstructions}
                  </Typography>
                </Box>
              )}
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Payment Method:</strong>
                </Typography>
                <Typography variant="body1">
                  {currentOrder.paymentMethod}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Timeline
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TimeIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    <strong>Order Placed:</strong>
                  </Typography>
                </Box>
                <Typography variant="body2">
                  {formatDate(currentOrder.orderTime)}
                </Typography>
              </Box>
              
              {currentOrder.estimatedDeliveryTime && (
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <DeliveryIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      <strong>Estimated Delivery:</strong>
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    {formatDate(currentOrder.estimatedDeliveryTime)}
                  </Typography>
                </Box>
              )}
              
              {currentOrder.actualDeliveryTime && (
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CheckIcon sx={{ fontSize: 16, mr: 1, color: 'success.main' }} />
                    <Typography variant="body2" color="text.secondary">
                      <strong>Delivered:</strong>
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    {formatDate(currentOrder.actualDeliveryTime)}
                  </Typography>
                </Box>
              )}
              
              {currentOrder.deliveryPersonName && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Delivery Person:</strong>
                  </Typography>
                  <Typography variant="body2">
                    {currentOrder.deliveryPersonName}
                  </Typography>
                  {currentOrder.deliveryPersonPhone && (
                    <Typography variant="body2">
                      {currentOrder.deliveryPersonPhone}
                    </Typography>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrderDetail;