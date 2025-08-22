import React, { useEffect, useState } from 'react';
import { Container, Grid, Card, CardActionArea, CardContent, CardMedia, Typography, Chip, Skeleton } from '@mui/material';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useToast } from '../components/ToastProvider';

const RestaurantCardSkeleton = () => (
	<Card>
		<Skeleton variant="rectangular" height={160} />
		<CardContent>
			<Skeleton width="60%" />
			<Skeleton width="40%" />
			<Skeleton width="80%" />
		</CardContent>
	</Card>
);

const Home = () => {
	const [restaurants, setRestaurants] = useState([]);
	const [loading, setLoading] = useState(true);
	const { showToast } = useToast();
	
	useEffect(() => {
		const fetchRestaurants = async () => {
			try {
				const res = await api.get('/restaurants');
				setRestaurants(res.data);
			} catch (err) {
				showToast(err.message || 'Failed to load restaurants', 'error');
			} finally {
				setLoading(false);
			}
		};
		fetchRestaurants();
	}, [showToast]);
	
	return (
		<Container sx={{ py: 4 }}>
			<Typography variant="h4" sx={{ mb: 2, fontWeight: 800 }}>Top restaurants near you</Typography>
			<Grid container spacing={2}>
				{loading
					? Array.from({ length: 8 }).map((_, i) => (
						<Grid item xs={12} sm={6} md={3} key={i}>
							<RestaurantCardSkeleton />
						</Grid>
					))
					: restaurants.map((r) => (
						<Grid item xs={12} sm={6} md={3} key={r.id}>
							<Card sx={{ borderRadius: 2, overflow: 'hidden', '&:hover': { boxShadow: 3 } }}>
								<CardActionArea component={Link} to={`/restaurant/${r.id}`}>
									<CardMedia component="img" height="160" image={r.imageUrl} alt={r.name} />
									<CardContent>
										<Typography variant="h6" sx={{ fontWeight: 700 }}>{r.name}</Typography>
										<Typography variant="body2" color="text.secondary" noWrap>{r.description}</Typography>
										<Typography variant="body2" sx={{ mt: 1 }}>{r.cuisine} • {r.deliveryTime} mins</Typography>
										<Chip size="small" label={`${r.rating} ★`} sx={{ mt: 1 }} />
									</CardContent>
								</CardActionArea>
							</Card>
						</Grid>
					))}
			</Grid>
		</Container>
	);
};

export default Home;