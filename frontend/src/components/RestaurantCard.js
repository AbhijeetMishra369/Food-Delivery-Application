import React from 'react';
import { Card, CardActionArea, CardContent, CardMedia, Typography, Chip, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
	if (!restaurant) return null;
	return (
		<Card sx={{ borderRadius: 2, overflow: 'hidden', transition: 'box-shadow .2s ease', '&:hover': { boxShadow: 3 } }}>
			<CardActionArea component={Link} to={`/restaurant/${restaurant.id}`}>
				<Box sx={{ position: 'relative' }}>
					<CardMedia component="img" height="160" image={restaurant.imageUrl || 'https://via.placeholder.com/600x400?text=Restaurant'} alt={restaurant.name} onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/600x400?text=Restaurant'; }} />
					<Chip size="small" label={`${restaurant.rating} ★`} sx={{ position: 'absolute', right: 8, bottom: 8, bgcolor: 'background.paper' }} />
				</Box>
				<CardContent>
					<Typography variant="h6" sx={{ fontWeight: 700 }} noWrap>{restaurant.name}</Typography>
					<Typography variant="body2" color="text.secondary" noWrap>{restaurant.description}</Typography>
					<Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">{restaurant.cuisine} • {restaurant.deliveryTime} mins</Typography>
				</CardContent>
			</CardActionArea>
		</Card>
	);
};

export default RestaurantCard;