import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Link as MuiLink,
  Grid,
  MenuItem,
} from '@mui/material';
import { register, clearError } from '../store/slices/authSlice';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    role: 'USER',
  });
  
  const [validationErrors, setValidationErrors] = useState({});
  const [serverFieldErrors, setServerFieldErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  useEffect(() => {
    // Map structured ApiError to UI
    if (error && typeof error === 'object') {
      if (error.fieldErrors) {
        setServerFieldErrors(error.fieldErrors);
      } else {
        setServerFieldErrors({});
      }
    } else {
      setServerFieldErrors({});
    }
  }, [error]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.phone) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = 'Phone number must be 10 digits';
    }
    
    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    } else if (formData.address.length < 10) {
      errors.address = 'Address must be at least 10 characters';
    }

    if (!formData.role || !['USER', 'ADMIN'].includes(formData.role)) {
      errors.role = 'Please select a valid role';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    // Clear server field error as user edits that field
    if (serverFieldErrors[name]) {
      setServerFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const { confirmPassword, ...registrationData } = formData;
      const resultAction = await dispatch(register(registrationData));
      if (register.fulfilled.match(resultAction)) {
        navigate('/login', { replace: true, state: { registeredEmail: formData.email } });
      }
    }
  };

  const friendlyServerMessage = () => {
    if (!error) return null;
    if (typeof error === 'string') return error;
    if (error.message) return error.message;
    if (error.code === 'AUTHENTICATION_FAILED') return 'Invalid email or password.';
    if (error.code === 'VALIDATION_ERROR') return 'Please fix the highlighted fields.';
    return 'Something went wrong. Please try again.';
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Create Account
        </Typography>
        
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
          Join us and start ordering delicious food!
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {friendlyServerMessage()}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={!!(validationErrors.firstName || serverFieldErrors.firstName)}
                helperText={validationErrors.firstName || serverFieldErrors.firstName}
                margin="normal"
                required
                autoComplete="given-name"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={!!(validationErrors.lastName || serverFieldErrors.lastName)}
                helperText={validationErrors.lastName || serverFieldErrors.lastName}
                margin="normal"
                required
                autoComplete="family-name"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!(validationErrors.email || serverFieldErrors.email)}
                helperText={validationErrors.email || serverFieldErrors.email}
                margin="normal"
                required
                autoComplete="email"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={!!(validationErrors.password || serverFieldErrors.password)}
                helperText={validationErrors.password || serverFieldErrors.password}
                margin="normal"
                required
                autoComplete="new-password"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!validationErrors.confirmPassword}
                helperText={validationErrors.confirmPassword}
                margin="normal"
                required
                autoComplete="new-password"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={!!(validationErrors.phone || serverFieldErrors.phone)}
                helperText={validationErrors.phone || serverFieldErrors.phone}
                margin="normal"
                required
                autoComplete="tel"
                placeholder="1234567890"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                multiline
                rows={3}
                value={formData.address}
                onChange={handleChange}
                error={!!(validationErrors.address || serverFieldErrors.address)}
                helperText={validationErrors.address || serverFieldErrors.address}
                margin="normal"
                required
                autoComplete="street-address"
                placeholder="Enter your full delivery address"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                error={!!(validationErrors.role || serverFieldErrors.role)}
                helperText={validationErrors.role || serverFieldErrors.role || 'Select USER for regular account'}
                margin="normal"
                required
              >
                <MenuItem value="USER">User</MenuItem>
                <MenuItem value="ADMIN">Admin</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Create Account'}
          </Button>

          <Typography variant="body2" align="center">
            Already have an account?{' '}
            <MuiLink component={Link} to="/login">Sign in</MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;