import React, { useEffect, useState, useMemo } from 'react';
import { Container, Grid, Typography, Skeleton, Box, Chip, Paper, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useToast } from '../components/ToastProvider';
import RestaurantCard from '../components/RestaurantCard';
import CategoryCarousel from '../components/CategoryCarousel';
import OffersCarousel from '../components/OffersCarousel';

const RestaurantCardSkeleton = () => (
	<Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
		<Skeleton variant="rectangular" height={160} />
		<Box sx={{ p: 2 }}>
			<Skeleton width="60%" />
			<Skeleton width="40%" />
			<Skeleton width="80%" />
		</Box>
	</Paper>
);

const Home = () => {
	const [restaurants, setRestaurants] = useState([]);
	const [loading, setLoading] = useState(true);
	const [category, setCategory] = useState('All');
	const [onlyFast, setOnlyFast] = useState(false);
	const [minRating, setMinRating] = useState(0);
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
	
	const categories = useMemo(() => {
		const set = new Set(['All']);
		restaurants.forEach(r => r.cuisine && set.add(r.cuisine));
		return Array.from(set);
	}, [restaurants]);
	
	const filtered = useMemo(() => {
		let list = restaurants;
		if (category !== 'All') list = list.filter(r => r.cuisine === category);
		if (onlyFast) list = list.filter(r => r.deliveryTime <= 30);
		if (minRating > 0) list = list.filter(r => (r.rating || 0) >= minRating);
		return list;
	}, [restaurants, category, onlyFast, minRating]);
	
	return (
		<>
			<Box sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
				<Container sx={{ py: 4 }}>
					<Alert variant="outlined" severity="success" sx={{ mb: 2 }}>UPTO 60% OFF on select restaurants near you!</Alert>
					<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
						<Box>
							<Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>Order food from top restaurants</Typography>
							<Typography variant="body1" color="text.secondary">Quick delivery • Best offers • Tasty meals</Typography>
						</Box>
						<Box>
							<Chip label="Veg" variant="outlined" sx={{ mr: 1 }} />
							<Chip label="Rating 4.0+" variant={minRating >= 4 ? 'filled' : 'outlined'} color={minRating >= 4 ? 'primary' : 'default'} onClick={() => setMinRating(minRating >= 4 ? 0 : 4)} sx={{ mr: 1 }} />
							<Chip label="Fast Delivery" variant={onlyFast ? 'filled' : 'outlined'} color={onlyFast ? 'primary' : 'default'} onClick={() => setOnlyFast(v => !v)} />
						</Box>
					</Box>
					<CategoryCarousel categories={categories} activeCategory={category} onSelect={setCategory} />
					<Box sx={{ mt: 2 }}>
						<OffersCarousel />
					</Box>
				</Container>
			</Box>
			<Container sx={{ py: 4 }}>
				<Typography variant="h5" sx={{ mb: 2, fontWeight: 800 }}>Top restaurants near you</Typography>
				<Grid container spacing={2}>
					{loading
						? Array.from({ length: 8 }).map((_, i) => (
							<Grid item xs={12} sm={6} md={3} key={i}>
								<RestaurantCardSkeleton />
							</Grid>
						))
						: filtered.map((r) => (
							<Grid item xs={12} sm={6} md={3} key={r.id}>
								<RestaurantCard restaurant={r} />
							</Grid>
						))}
				</Grid>
			</Container>
		</>
	);
};

export default Home;