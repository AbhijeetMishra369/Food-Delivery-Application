import React from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const CategoryCarousel = ({ categories = [], activeCategory, onSelect }) => {
	const handleSelect = (cat) => {
		if (onSelect) onSelect(cat);
	};
	return (
		<Box sx={{ my: 2 }}>
			<Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>What's on your mind?</Typography>
			<Swiper spaceBetween={8} slidesPerView={'auto'} style={{ padding: '4px 0' }}>
				{categories.map((cat) => (
					<SwiperSlide key={cat} style={{ width: 'auto' }}>
						<Chip
							label={cat}
							clickable
							color={activeCategory === cat ? 'primary' : 'default'}
							onClick={() => handleSelect(cat)}
							sx={{ mr: 1 }}
						/>
					</SwiperSlide>
				))}
			</Swiper>
		</Box>
	);
};

export default CategoryCarousel;