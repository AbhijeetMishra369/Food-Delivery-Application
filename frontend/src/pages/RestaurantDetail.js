import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Container, Grid, Typography, Card, CardContent, CardMedia, Skeleton, Button, Box, Chip, Paper } from '@mui/material';
import api from '../api/client';
import { useToast } from '../components/ToastProvider';
import { addToCart } from '../store/slices/cartSlice';

const MenuItemSkeleton = () => (
	<Card>
		<Skeleton variant="rectangular" height={120} />
		<CardContent>
			<Skeleton width="70%" />
			<Skeleton width="50%" />
		</CardContent>
	</Card>
);

const RestaurantDetail = () => {
	const { id } = useParams();
	const dispatch = useDispatch();
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
	
	return (
		<>
			<Box sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
				<Container sx={{ py: 3 }}>
					{loading ? (
						<>
							<Skeleton variant="text" width={260} height={48} />
							<Skeleton variant="text" width={360} />
						</>
					) : (
						restaurant && (
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
								<Box sx={{ width: 72, height: 72, overflow: 'hidden', borderRadius: 2 }}>
									<img src={restaurant.imageUrl} alt={restaurant.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
						{items.map(item => (
							<Grid item xs={12} sm={6} md={4} key={item.id}>
								<Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
									<CardMedia component="img" height="140" image={item.imageUrl} alt={item.name} />
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
				)}
			</Container>
		</>
	);
};

export default RestaurantDetail;