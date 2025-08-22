import React, { useEffect, useMemo, useState } from 'react';
import { Container, Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, Switch, FormControlLabel, CircularProgress, Alert } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import api from '../api/client';
import { useToast } from '../components/ToastProvider';

const emptyForm = {
	name: '',
	description: '',
	address: '',
	phone: '',
	email: '',
	cuisine: '',
	imageUrl: '',
	deliveryTime: 30,
	deliveryFee: 5.0,
	minimumOrder: 10.0,
	active: true,
	open: true,
};

const AdminRestaurants = () => {
	const { showToast } = useToast();
	const [restaurants, setRestaurants] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [dialogOpen, setDialogOpen] = useState(false);
	const [saving, setSaving] = useState(false);
	const [form, setForm] = useState(emptyForm);
	const [formErrors, setFormErrors] = useState({});
	const [editingId, setEditingId] = useState(null);
	const [deleteId, setDeleteId] = useState(null);
	const [deleteLoading, setDeleteLoading] = useState(false);

	const fetchAll = async () => {
		setLoading(true);
		setError('');
		try {
			const res = await api.get('/restaurants');
			setRestaurants(res.data || []);
		} catch (e) {
			setError(e?.message || 'Failed to load restaurants');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => { fetchAll(); }, []);

	const handleOpenCreate = () => {
		setForm(emptyForm);
		setFormErrors({});
		setEditingId(null);
		setDialogOpen(true);
	};

	const handleOpenEdit = (r) => {
		setForm({
			name: r.name || '',
			description: r.description || '',
			address: r.address || '',
			phone: r.phone || '',
			email: r.email || '',
			cuisine: r.cuisine || '',
			imageUrl: r.imageUrl || '',
			deliveryTime: r.deliveryTime ?? 30,
			deliveryFee: r.deliveryFee ?? 5.0,
			minimumOrder: r.minimumOrder ?? 10.0,
			active: r.active ?? true,
			open: r.open ?? true,
		});
		setFormErrors({});
		setEditingId(r.id);
		setDialogOpen(true);
	};

	const validate = () => {
		const errors = {};
		if (!form.name.trim()) errors.name = 'Restaurant name is required';
		else if (form.name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
		if (!form.description.trim()) errors.description = 'Description is required';
		else if (form.description.trim().length < 10) errors.description = 'Description must be at least 10 characters';
		if (!form.address.trim()) errors.address = 'Address is required';
		else if (form.address.trim().length < 10) errors.address = 'Address must be at least 10 characters';
		if (!form.phone.trim()) errors.phone = 'Phone is required';
		else if (!/^\d{10}$/.test(form.phone.trim())) errors.phone = 'Phone number must be 10 digits';
		if (!form.email.trim()) errors.email = 'Email is required';
		else if (!/\S+@\S+\.\S+/.test(form.email.trim())) errors.email = 'Email is invalid';
		if (!form.cuisine.trim()) errors.cuisine = 'Cuisine is required';
		if (form.deliveryTime < 0) errors.deliveryTime = 'Delivery time must be 0 or more';
		if (form.deliveryFee < 0) errors.deliveryFee = 'Delivery fee cannot be negative';
		if (form.minimumOrder < 0) errors.minimumOrder = 'Minimum order cannot be negative';
		setFormErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleSave = async () => {
		if (!validate()) return;
		setSaving(true);
		setFormErrors({});
		try {
			if (editingId) {
				await api.put(`/restaurants/${editingId}`, form);
				showToast('Restaurant updated', 'success');
			} else {
				await api.post('/restaurants', form);
				showToast('Restaurant created', 'success');
			}
			setDialogOpen(false);
			setEditingId(null);
			await fetchAll();
		} catch (e) {
			if (e?.fieldErrors) setFormErrors(e.fieldErrors);
			showToast(e?.message || 'Failed to save restaurant', 'error');
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async (id) => {
		setDeleteId(id);
		setDeleteLoading(true);
		try {
			await api.delete(`/restaurants/${id}`);
			showToast('Restaurant deleted', 'success');
			await fetchAll();
		} catch (e) {
			showToast(e?.message || 'Failed to delete restaurant', 'error');
		} finally {
			setDeleteLoading(false);
			setDeleteId(null);
		}
	};

	return (
		<Container sx={{ py: 4 }}>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
				<Typography variant="h4" sx={{ fontWeight: 800 }}>Manage Restaurants</Typography>
				<Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>Add Restaurant</Button>
			</Box>
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
								<TableCell>Name</TableCell>
								<TableCell>Cuisine</TableCell>
								<TableCell>Delivery Time</TableCell>
								<TableCell>Active</TableCell>
								<TableCell>Open</TableCell>
								<TableCell align="right">Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{restaurants.map((r) => (
								<TableRow key={r.id} hover>
									<TableCell>{r.name}</TableCell>
									<TableCell>{r.cuisine}</TableCell>
									<TableCell>{r.deliveryTime} mins</TableCell>
									<TableCell>{r.active ? 'Yes' : 'No'}</TableCell>
									<TableCell>{r.open ? 'Yes' : 'No'}</TableCell>
									<TableCell align="right">
										<IconButton size="small" onClick={() => handleOpenEdit(r)}><EditIcon /></IconButton>
										<IconButton size="small" color="error" onClick={() => handleDelete(r.id)} disabled={deleteLoading && deleteId === r.id}>
											{deleteLoading && deleteId === r.id ? <CircularProgress size={18} /> : <DeleteIcon />}
										</IconButton>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			)}

			<Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
				<DialogTitle>{editingId ? 'Edit Restaurant' : 'Add Restaurant'}</DialogTitle>
				<DialogContent>
					<Box sx={{ mt: 1 }}>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<TextField fullWidth label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={!!formErrors.name} helperText={formErrors.name} required />
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField fullWidth label="Cuisine" value={form.cuisine} onChange={(e) => setForm({ ...form, cuisine: e.target.value })} error={!!formErrors.cuisine} helperText={formErrors.cuisine} required />
							</Grid>
							<Grid item xs={12}>
								<TextField fullWidth label="Description" multiline rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} error={!!formErrors.description} helperText={formErrors.description} required />
							</Grid>
							<Grid item xs={12}>
								<TextField fullWidth label="Address" multiline rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} error={!!formErrors.address} helperText={formErrors.address} required />
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField fullWidth label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} error={!!formErrors.phone} helperText={formErrors.phone} required placeholder="1234567890" />
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField fullWidth label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={!!formErrors.email} helperText={formErrors.email} required />
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField fullWidth label="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} error={!!formErrors.imageUrl} helperText={formErrors.imageUrl} />
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField fullWidth type="number" label="Delivery Time (mins)" value={form.deliveryTime} onChange={(e) => setForm({ ...form, deliveryTime: Number(e.target.value) })} error={!!formErrors.deliveryTime} helperText={formErrors.deliveryTime} />
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField fullWidth type="number" label="Delivery Fee (₹)" value={form.deliveryFee} onChange={(e) => setForm({ ...form, deliveryFee: Number(e.target.value) })} error={!!formErrors.deliveryFee} helperText={formErrors.deliveryFee} />
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField fullWidth type="number" label="Minimum Order (₹)" value={form.minimumOrder} onChange={(e) => setForm({ ...form, minimumOrder: Number(e.target.value) })} error={!!formErrors.minimumOrder} helperText={formErrors.minimumOrder} />
							</Grid>
							<Grid item xs={12} sm={6}>
								<FormControlLabel control={<Switch checked={!!form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />} label="Active" />
							</Grid>
							<Grid item xs={12} sm={6}>
								<FormControlLabel control={<Switch checked={!!form.open} onChange={(e) => setForm({ ...form, open: e.target.checked })} />} label="Open" />
							</Grid>
						</Grid>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDialogOpen(false)}>Cancel</Button>
					<Button onClick={handleSave} variant="contained" disabled={saving}>{saving ? <CircularProgress size={20} /> : 'Save'}</Button>
				</DialogActions>
			</Dialog>
		</Container>
	);
};

export default AdminRestaurants;