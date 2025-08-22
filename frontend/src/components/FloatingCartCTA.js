import React from 'react';
import { useSelector } from 'react-redux';
import { Paper, Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const FloatingCartCTA = () => {
	const navigate = useNavigate();
	const { items, total } = useSelector((state) => state.cart);
	if (!items || items.length === 0) return null;
	const itemCount = items.reduce((acc, it) => acc + it.quantity, 0);
	return (
		<Paper elevation={3} sx={{ position: 'fixed', left: 16, right: 16, bottom: 16, zIndex: 1200, borderRadius: 999, px: 2, py: 1.25, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
			<Box>
				<Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{itemCount} item{itemCount > 1 ? 's' : ''} in cart</Typography>
				<Typography variant="caption" color="text.secondary">Total: ₹{(total + 5 + total * 0.1).toFixed(2)}</Typography>
			</Box>
			<Button size="small" variant="contained" onClick={() => navigate('/cart')}>View Cart</Button>
		</Paper>
	);
};

export default FloatingCartCTA;