import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import { fetchOrderById } from '../store/slices/orderSlice';

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

const OrderDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { currentOrder, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    if (isAuthenticated && id) {
      dispatch(fetchOrderById(id));
    }
  }, [dispatch, id, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="info">
          Please login to view order details.
        </Alert>
      </Container>
    );
  }

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
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="info">Order not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Order Details
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="h5" component="h2">
                  Order #{currentOrder.orderNumber}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    label={currentOrder.status}
                    color={getStatusColor(currentOrder.status)}
                  />
                  <Chip
                    label={currentOrder.paymentStatus}
                    color={getPaymentStatusColor(currentOrder.paymentStatus)}
                  />
                </Box>
              </Box>

              <Typography variant="body1" gutterBottom>
                <strong>Restaurant:</strong> {currentOrder.restaurantName}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                <strong>Order Time:</strong> {new Date(currentOrder.orderTime).toLocaleString()}
              </Typography>

              {currentOrder.estimatedDeliveryTime && (
                <Typography variant="body2" color="text.secondary">
                  <strong>Estimated Delivery:</strong> {new Date(currentOrder.estimatedDeliveryTime).toLocaleString()}
                </Typography>
              )}

              {currentOrder.actualDeliveryTime && (
                <Typography variant="body2" color="text.secondary">
                  <strong>Delivered:</strong> {new Date(currentOrder.actualDeliveryTime).toLocaleString()}
                </Typography>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Items
              </Typography>
              
              <List>
                {currentOrder.orderItems?.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <ListItem>
                      <ListItemText
                        primary={item.menuItemName}
                        secondary={`Quantity: ${item.quantity}`}
                      />
                      <Typography variant="body1">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </Typography>
                    </ListItem>
                    {index < currentOrder.orderItems.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Delivery Information
              </Typography>
              
              <Typography variant="body2" paragraph>
                <strong>Address:</strong><br />
                {currentOrder.deliveryAddress}
              </Typography>
              
              <Typography variant="body2" paragraph>
                <strong>Phone:</strong> {currentOrder.deliveryPhone}
              </Typography>
              
              {currentOrder.deliveryInstructions && (
                <Typography variant="body2" paragraph>
                  <strong>Instructions:</strong><br />
                  {currentOrder.deliveryInstructions}
                </Typography>
              )}
              
              {currentOrder.deliveryPersonName && (
                <Typography variant="body2" paragraph>
                  <strong>Delivery Person:</strong> {currentOrder.deliveryPersonName}
                </Typography>
              )}
              
              {currentOrder.deliveryPersonPhone && (
                <Typography variant="body2">
                  <strong>Contact:</strong> {currentOrder.deliveryPersonPhone}
                </Typography>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal:</Typography>
                <Typography>${currentOrder.subtotal?.toFixed(2) || '0.00'}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Delivery Fee:</Typography>
                <Typography>${currentOrder.deliveryFee?.toFixed(2) || '0.00'}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Tax:</Typography>
                <Typography>${currentOrder.tax?.toFixed(2) || '0.00'}</Typography>
              </Box>
              
              <Divider sx={{ my: 1 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6">${currentOrder.total?.toFixed(2) || '0.00'}</Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Payment Method: {currentOrder.paymentMethod}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrderDetail;