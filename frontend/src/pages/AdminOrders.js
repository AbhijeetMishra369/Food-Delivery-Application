import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, CircularProgress, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import api from '../api/client';
import { useToast } from '../components/ToastProvider';

const statuses = ['PENDING','CONFIRMED','PREPARING','READY_FOR_DELIVERY','OUT_FOR_DELIVERY','DELIVERED','CANCELLED'];
const paymentStatuses = ['PENDING','COMPLETED','FAILED','REFUNDED'];

const AdminOrders = () => {
	const { showToast } = useToast();
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	const fetchOrders = async () => {
		setLoading(true);
		setError('');
		try {
			// For simplicity, fetch all restaurants' orders may not exist; if specific restaurant is needed, adapt accordingly.
			// Using a fallback endpoint is not provided; skip if backend requires restaurantId.
			const res = await api.get('/orders/restaurant/1');
			setOrders(res.data || []);
		} catch (e) {
			setError(e?.message || 'Failed to load orders');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => { fetchOrders(); }, []);

	const updateStatus = async (id, status) => {
		try {
			await api.put(`/orders/${id}/status`, null, { params: { status } });
			showToast('Status updated', 'success');
			await fetchOrders();
		} catch (e) {
			showToast(e?.message || 'Failed to update status', 'error');
		}
	};
	const updatePaymentStatus = async (id, paymentStatus) => {
		try {
			await api.put(`/orders/${id}/payment-status`, null, { params: { paymentStatus } });
			showToast('Payment status updated', 'success');
			await fetchOrders();
		} catch (e) {
			showToast(e?.message || 'Failed to update payment status', 'error');
		}
	};

	return (
		<Container sx={{ py: 4 }}>
			<Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>Manage Orders</Typography>
			{error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
			{loading ? (
				<Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
					<CircularProgress />
				</Box>
			) : (
				<TableContainer component={Paper}>
					<Table size="small">
						<TableHead>
							<TableRow>
								<TableCell>Order #</TableCell>
								<TableCell>Restaurant</TableCell>
								<TableCell>Total</TableCell>
								<TableCell>Status</TableCell>
								<TableCell>Payment</TableCell>
								<TableCell>User</TableCell>
								<TableCell>Time</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{orders.map((o) => (
								<TableRow key={o.id}>
									<TableCell>#{o.orderNumber}</TableCell>
									<TableCell>{o.restaurantName}</TableCell>
									<TableCell>₹{o.total.toFixed(2)}</TableCell>
									<TableCell>
										<FormControl size="small" sx={{ minWidth: 160 }}>
											<InputLabel id={`status-${o.id}`}>Status</InputLabel>
											<Select labelId={`status-${o.id}`} value={o.status} label="Status" onChange={(e) => updateStatus(o.id, e.target.value)}>
												{statuses.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
											</Select>
										</FormControl>
									</TableCell>
									<TableCell>
										<FormControl size="small" sx={{ minWidth: 160 }}>
											<InputLabel id={`pstatus-${o.id}`}>Payment</InputLabel>
											<Select labelId={`pstatus-${o.id}`} value={o.paymentStatus} label="Payment" onChange={(e) => updatePaymentStatus(o.id, e.target.value)}>
												{paymentStatuses.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
											</Select>
										</FormControl>
									</TableCell>
									<TableCell>{o.userEmail}</TableCell>
									<TableCell>{new Date(o.createdAt).toLocaleString()}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			)}
		</Container>
	);
};

export default AdminOrders;