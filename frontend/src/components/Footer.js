import React from 'react';
import { Box, Container, Typography, Link as MuiLink } from '@mui/material';

const Footer = () => {
	return (
		<Box component="footer" sx={{ borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', mt: 4 }}>
			<Container sx={{ py: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
				<Typography variant="body2" color="text.secondary">© {new Date().getFullYear()} Food Delivery</Typography>
				<Box sx={{ display: 'flex', gap: 2 }}>
					<MuiLink href="#" color="inherit" underline="hover" variant="body2">About</MuiLink>
					<MuiLink href="#" color="inherit" underline="hover" variant="body2">Help</MuiLink>
					<MuiLink href="#" color="inherit" underline="hover" variant="body2">Terms</MuiLink>
					<MuiLink href="#" color="inherit" underline="hover" variant="body2">Privacy</MuiLink>
				</Box>
			</Container>
		</Box>
	);
};

export default Footer;