import React from 'react';
import { Box } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const defaultOffers = [
	{ id: 1, image: 'https://images.unsplash.com/photo-1604908177741-8b1d3c2bd669?q=80&w=1200&auto=format&fit=crop', alt: 'Flat 50% Off' },
	{ id: 2, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop', alt: 'Free Delivery' },
	{ id: 3, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=1200&auto=format&fit=crop', alt: 'Combo Deals' },
];

const OffersCarousel = ({ offers = defaultOffers }) => {
	return (
		<Box sx={{ borderRadius: 2, overflow: 'hidden' }}>
			<Swiper spaceBetween={12} slidesPerView={1}>
				{offers.map((o) => (
					<SwiperSlide key={o.id}>
						<img src={o.image} alt={o.alt} style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }} />
					</SwiperSlide>
				))}
			</Swiper>
		</Box>
	);
};

export default OffersCarousel;