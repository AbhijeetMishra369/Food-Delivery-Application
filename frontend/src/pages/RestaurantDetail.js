import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Grid, Typography, Card, CardContent, CardMedia, Skeleton, Button, Box, Chip, Paper, Divider } from '@mui/material';
import api from '../api/client';
import { useToast } from '../components/ToastProvider';
import { addToCart } from '../store/slices/cartSlice';

const MenuItemSkeleton = () => (
	<Card>
		<Skeleton variant="rectangular" height={120} animation="wave" />
		<CardContent>
			<Skeleton width="70%" animation="wave" />
			<Skeleton width="50%" animation="wave" />
		</CardContent>
	</Card>
);

const RestaurantDetail = () => {
	const { id } = useParams();
	const dispatch = useDispatch();
	const cart = useSelector((state) => state.cart);
	const [restaurant, setRestaurant] = useState(null);
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const { showToast } = useToast();
	
	useEffect(() => {
		const fetchData = async () => {
			try {
				const [r, m] = await Promise.all([
					api.get(`/restaurants/${id}`),
					api.get(`/menu-items/restaurant/${id}`)
				]);
			setRestaurant(r.data);
			setItems(m.data);
		} catch (err) {
			showToast(err.message || 'Failed to load restaurant', 'error');
		} finally {
			setLoading(false);
		}
		};
		fetchData();
	}, [id, showToast]);

	const handleAdd = (menuItem) => {
		dispatch(addToCart({ item: menuItem, restaurantId: Number(id) }));
		showToast('Added to cart', 'success');
	};
	
	const subtotal = cart.total;
	const deliveryFee = 5;
	const tax = subtotal * 0.1;
	const grandTotal = subtotal + deliveryFee + tax;
	
	return (
		<>
			<Box sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
				<Container sx={{ py: 3 }}>
					{loading ? (
						<>
							<Skeleton variant="text" width={260} height={48} animation="wave" />
							<Skeleton variant="text" width={360} animation="wave" />
						</>
					) : (
						restaurant && (
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
								<Box sx={{ width: 72, height: 72, overflow: 'hidden', borderRadius: 2 }}>
									<img src={restaurant.imageUrl || 'https://via.placeholder.com/128?text=Restaurant'} alt={restaurant.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/128?text=Restaurant'; }} />
								</Box>
								<Box>
									<Typography variant="h4" sx={{ fontWeight: 800 }}>{restaurant.name}</Typography>
									<Typography variant="body1" color="text.secondary">{restaurant.cuisine} • {restaurant.deliveryTime} mins</Typography>
									<Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
										<Chip size="small" label={`${restaurant.rating} ★`} />
										{restaurant.costForTwo && (<Chip size="small" label={`₹${restaurant.costForTwo} for two`} />)}
									</Box>
								</Box>
							</Box>
						)
					)}
				</Container>
			</Box>
			<Container sx={{ py: 3 }}>
				{loading ? (
					<Grid container spacing={2} sx={{ mt: 1 }}>
						{Array.from({ length: 6 }).map((_, i) => (
							<Grid item xs={12} sm={6} md={4} key={i}>
								<MenuItemSkeleton />
							</Grid>
						))}
					</Grid>
				) : (
					<Grid container spacing={2} sx={{ mt: 1 }}>
						<Grid item xs={12} md={8}>
							<Grid container spacing={2}>
								{items.map(item => (
									<Grid item xs={12} sm={6} key={item.id}>
										<Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
											<CardMedia component="img" height="140" image={item.imageUrl || 'https://via.placeholder.com/400x300?text=Dish'} alt={item.name} onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x300?text=Dish'; }} />
											<CardContent sx={{ flexGrow: 1 }}>
												<Typography variant="h6" sx={{ fontWeight: 700 }}>{item.name}</Typography>
												<Typography variant="body2" color="text.secondary" noWrap>{item.description}</Typography>
												<Typography variant="body1" sx={{ mt: 1 }}>₹{item.price}</Typography>
											</CardContent>
											<Box sx={{ px: 2, pb: 2 }}>
												<Button fullWidth variant="contained" size="small" onClick={() => handleAdd(item)}>Add to Cart</Button>
											</Box>
										</Card>
									</Grid>
								))}
							</Grid>
						</Grid>
						<Grid item xs={12} md={4} sx={{ display: { xs: 'none', md: 'block' } }}>
							<Paper sx={{ position: 'sticky', top: 96, p: 2 }}>
								<Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Your Cart</Typography>
								{cart.items.length === 0 ? (
									<Typography variant="body2" color="text.secondary">No items yet. Add something tasty!</Typography>
								) : (
									<>
										{cart.items.map((ci) => (
											<Box key={ci.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
												<Typography variant="body2">{ci.name} x{ci.quantity}</Typography>
												<Typography variant="body2">₹{(ci.price * ci.quantity).toFixed(2)}</Typography>
											</Box>
										))}
										<Divider sx={{ my: 1 }} />
										<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
											<Typography variant="body2">Subtotal</Typography>
											<Typography variant="body2">₹{subtotal.toFixed(2)}</Typography>
										</Box>
										<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
											<Typography variant="body2">Delivery Fee</Typography>
											<Typography variant="body2">₹{deliveryFee.toFixed(2)}</Typography>
										</Box>
										<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
											<Typography variant="body2">Tax</Typography>
											<Typography variant="body2">₹{tax.toFixed(2)}</Typography>
										</Box>
										<Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Total: ₹{grandTotal.toFixed(2)}</Typography>
										<Button variant="contained" fullWidth href="/cart">Checkout</Button>
									</>
								)}
							</Paper>
						</Grid>
					</Grid>
				)}
			</Container>
		</>
	);
};

export default RestaurantDetail;