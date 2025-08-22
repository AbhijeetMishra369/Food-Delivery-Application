import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Badge,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  InputBase,
  Paper,
  Chip,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Restaurant as RestaurantIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { logout } from '../store/slices/authSlice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const cartItemCount = items.reduce((count, item) => count + item.quantity, 0);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleMenuClose();
    navigate('/');
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate('/orders');
  };

  return (
    <AppBar position="fixed" elevation={1} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: 'background.paper', color: 'text.primary', borderBottom: '1px solid', borderColor: 'divider' }}>
      <Toolbar sx={{ gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{
            width: 34,
            height: 34,
            borderRadius: 1.5,
            bgcolor: 'primary.main',
            display: 'grid',
            placeItems: 'center'
          }}>
            <RestaurantIcon sx={{ color: '#fff' }} />
          </Box>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'text.primary',
              fontWeight: 800,
              letterSpacing: '-0.02em'
            }}
          >
            Food Delivery
          </Typography>
          <Chip icon={<LocationIcon />} label="Bengaluru" size="small" sx={{ ml: 1 }} />
        </Box>

        <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
          <Paper elevation={0} sx={{
            px: 2,
            py: 0.5,
            borderRadius: 2,
            border: '1px solid rgba(40,44,63,0.12)',
            maxWidth: 560,
            mx: 'auto'
          }}>
            <InputBase placeholder="Search for restaurants and dishes" fullWidth />
          </Paper>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {user?.role === 'ADMIN' && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button component={Link} to="/admin/restaurants" color="inherit">Restaurants</Button>
              <Button component={Link} to="/admin/categories" color="inherit">Categories</Button>
              <Button component={Link} to="/admin/menu-items" color="inherit">Menu Items</Button>
              <Button component={Link} to="/admin/orders" color="inherit">Orders</Button>
            </Box>
          )}
          {isAuthenticated ? (
            <>
              <IconButton
                color="inherit"
                component={Link}
                to="/cart"
                sx={{ position: 'relative' }}
              >
                <Badge badgeContent={cartItemCount} color="secondary">
                  <CartIcon />
                </Badge>
              </IconButton>

              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
                sx={{ ml: 1 }}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                  <PersonIcon />
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={handleProfile}>
                  <Typography variant="body2">
                    {user?.firstName} {user?.lastName}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleProfile}>My Orders</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/login"
                sx={{ textTransform: 'none' }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/register"
                sx={{ textTransform: 'none' }}
              >
                Sign up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;