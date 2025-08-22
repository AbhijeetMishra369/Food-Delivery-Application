import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { Container, Grid, Typography, Skeleton, Box, Chip, Paper, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useToast } from '../components/ToastProvider';
import RestaurantCard from '../components/RestaurantCard';
import CategoryCarousel from '../components/CategoryCarousel';
import OffersCarousel from '../components/OffersCarousel';

const RestaurantCardSkeleton = () => (
	<Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
		<Skeleton variant="rectangular" height={160} animation="wave" />
		<Box sx={{ p: 2 }}>
			<Skeleton width="60%" animation="wave" />
			<Skeleton width="40%" animation="wave" />
			<Skeleton width="80%" animation="wave" />
		</Box>
	</Paper>
);

const PAGE_SIZE = 12;

const Home = () => {
	const [restaurants, setRestaurants] = useState([]);
	const [initialLoading, setInitialLoading] = useState(true);
	const [loadingPage, setLoadingPage] = useState(false);
	const [page, setPage] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	const [category, setCategory] = useState('All');
	const [onlyFast, setOnlyFast] = useState(false);
	const [minRating, setMinRating] = useState(0);
	const { showToast } = useToast();
	const sentinelRef = useRef(null);
	
	const isFiltering = category !== 'All' || onlyFast || minRating > 0;
	
	const fetchPage = useCallback(async (pageToLoad) => {
		setLoadingPage(true);
		try {
			const res = await api.get('/restaurants/page', { params: { page: pageToLoad, size: PAGE_SIZE } });
			const content = res.data?.content || [];
			setRestaurants(prev => {
				const existingIds = new Set(prev.map(r => r.id));
				const merged = [...prev, ...content.filter(r => !existingIds.has(r.id))];
				return merged;
			});
			setHasMore(!(res.data?.last === true) && content.length > 0);
			setPage(pageToLoad + 1);
		} catch (err) {
			showToast(err.message || 'Failed to load restaurants', 'error');
			setHasMore(false);
		} finally {
			setInitialLoading(false);
			setLoadingPage(false);
		}
	}, [showToast]);
	
	useEffect(() => {
		// initial page load
		fetchPage(0);
	}, [fetchPage]);
	
	useEffect(() => {
		// Intersection observer for infinite scroll when not filtering
		if (isFiltering) return;
		const el = sentinelRef.current;
		if (!el) return;
		const observer = new IntersectionObserver((entries) => {
			const first = entries[0];
			if (first.isIntersecting && hasMore && !loadingPage) {
				fetchPage(page);
			}
		}, { rootMargin: '200px' });
		observer.observe(el);
		return () => observer.disconnect();
	}, [isFiltering, hasMore, loadingPage, page, fetchPage]);
	
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
				{isFiltering && (
					<Alert severity="info" sx={{ mb: 2 }}>Filters applied. Scroll will show matching items from loaded results. Clear filters to load more.</Alert>
				)}
				<Grid container spacing={2}>
					{initialLoading
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
				{!isFiltering && hasMore && (
					<Box ref={sentinelRef} sx={{ height: 1, mt: 2 }} />
				)}
				{loadingPage && (
					<Box sx={{ mt: 2 }}>
						<Grid container spacing={2}>
							{Array.from({ length: 4 }).map((_, i) => (
								<Grid item xs={12} sm={6} md={3} key={`sk-${i}`}>
									<RestaurantCardSkeleton />
								</Grid>
							))}
						</Grid>
					</Box>
				)}
			</Container>
		</>
	);
};

export default Home;