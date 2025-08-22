import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotAuthorized = () => {
	const navigate = useNavigate();
	return (
		<Container sx={{ py: 6 }}>
			<Box sx={{ textAlign: 'center' }}>
				<Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>Not authorized</Typography>
				<Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
					You don't have permission to access this page.
				</Typography>
				<Button variant="contained" onClick={() => navigate('/')}>Go Home</Button>
			</Box>
		</Container>
	);
};

export default NotAuthorized;