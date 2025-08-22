import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Grid, Typography, Card, CardContent, CardMedia, Skeleton, Button } from '@mui/material';
import api from '../api/client';
import { useToast } from '../components/ToastProvider';

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
	
	return (
		<Container sx={{ py: 4 }}>
			{loading ? (
				<>
					<Skeleton variant="text" width={260} height={48} />
					<Skeleton variant="text" width={360} />
					<Grid container spacing={2} sx={{ mt: 2 }}>
						{Array.from({ length: 6 }).map((_, i) => (
							<Grid item xs={12} sm={6} md={4} key={i}>
								<MenuItemSkeleton />
							</Grid>
						))}
					</Grid>
				</>
			) : (
				<>
					<Typography variant="h4" sx={{ fontWeight: 800 }}>{restaurant.name}</Typography>
					<Typography variant="body1" color="text.secondary">{restaurant.cuisine} • {restaurant.deliveryTime} mins</Typography>
					<Grid container spacing={2} sx={{ mt: 1 }}>
						{items.map(item => (
							<Grid item xs={12} sm={6} md={4} key={item.id}>
								<Card>
									<CardMedia component="img" height="140" image={item.imageUrl} alt={item.name} />
									<CardContent>
										<Typography variant="h6" sx={{ fontWeight: 700 }}>{item.name}</Typography>
										<Typography variant="body2" color="text.secondary" noWrap>{item.description}</Typography>
										<Typography variant="body1" sx={{ mt: 1 }}>₹{item.price}</Typography>
										<Button variant="contained" size="small" sx={{ mt: 1 }}>Add</Button>
									</CardContent>
								</Card>
							</Grid>
						))}
					</Grid>
				</>
			)}
		</Container>
	);
};

export default RestaurantDetail;