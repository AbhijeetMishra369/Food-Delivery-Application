import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, CircularProgress, Alert, MenuItem, Select, InputLabel, FormControl, Switch, FormControlLabel } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import api from '../api/client';
import { useToast } from '../components/ToastProvider';

const emptyForm = { name: '', description: '', price: 0, imageUrl: '', vegetarian: false, spicy: false, available: true, preparationTime: 15, restaurantId: '', categoryId: '' };

const AdminMenuItems = () => {
	const { showToast } = useToast();
	const [items, setItems] = useState([]);
	const [restaurants, setRestaurants] = useState([]);
	const [categories, setCategories] = useState([]);
	const [selectedRestaurant, setSelectedRestaurant] = useState('');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [dialogOpen, setDialogOpen] = useState(false);
	const [saving, setSaving] = useState(false);
	const [form, setForm] = useState(emptyForm);
	const [formErrors, setFormErrors] = useState({});
	const [editingId, setEditingId] = useState(null);
	const [deleteId, setDeleteId] = useState(null);
	const [deleteLoading, setDeleteLoading] = useState(false);

	const fetchRestaurants = async () => {
		const res = await api.get('/restaurants');
		setRestaurants(res.data || []);
	};
	const fetchCategories = async () => {
		const res = await api.get('/categories');
		setCategories(res.data || []);
	};
	const fetchItems = async (restaurantId) => {
		if (!restaurantId) { setItems([]); return; }
		const res = await api.get(`/menu-items/restaurant/${restaurantId}`);
		setItems(res.data || []);
	};

	useEffect(() => {
		(async () => {
			try {
				setLoading(true);
				await Promise.all([fetchRestaurants(), fetchCategories()]);
			} catch (e) {
				setError(e?.message || 'Failed to load data');
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	useEffect(() => { fetchItems(selectedRestaurant); }, [selectedRestaurant]);

	const handleOpenCreate = () => {
		setForm({ ...emptyForm, restaurantId: selectedRestaurant || '' });
		setFormErrors({});
		setEditingId(null);
		setDialogOpen(true);
	};

	const handleOpenEdit = (m) => {
		setForm({
			name: m.name || '',
			description: m.description || '',
			price: m.price ?? 0,
			imageUrl: m.imageUrl || '',
			vegetarian: !!m.vegetarian,
			spicy: !!m.spicy,
			available: m.available !== false,
			preparationTime: m.preparationTime ?? 15,
			restaurantId: selectedRestaurant,
			categoryId: m.categoryId || '',
		});
		setFormErrors({});
		setEditingId(m.id);
		setDialogOpen(true);
	};

	const validate = () => {
		const errors = {};
		if (!form.name.trim()) errors.name = 'Menu item name is required';
		else if (form.name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
		if (!form.description.trim()) errors.description = 'Description is required';
		else if (form.description.trim().length < 5) errors.description = 'Description must be at least 5 characters';
		if (!form.restaurantId) errors.restaurantId = 'Restaurant is required';
		if (!form.categoryId) errors.categoryId = 'Category is required';
		if (!(form.price > 0)) errors.price = 'Price must be greater than 0';
		if (form.preparationTime < 0) errors.preparationTime = 'Preparation time must be 0 or more';
		setFormErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleSave = async () => {
		if (!validate()) return;
		setSaving(true);
		setFormErrors({});
		try {
			if (editingId) {
				await api.put(`/menu-items/${editingId}`, form);
				showToast('Menu item updated', 'success');
			} else {
				await api.post('/menu-items', form);
				showToast('Menu item created', 'success');
			}
			setDialogOpen(false);
			setEditingId(null);
			await fetchItems(selectedRestaurant);
		} catch (e) {
			if (e?.fieldErrors) setFormErrors(e.fieldErrors);
			showToast(e?.message || 'Failed to save menu item', 'error');
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async (id) => {
		setDeleteId(id);
		setDeleteLoading(true);
		try {
			await api.delete(`/menu-items/${id}`);
			showToast('Menu item deleted', 'success');
			await fetchItems(selectedRestaurant);
		} catch (e) {
			showToast(e?.message || 'Failed to delete menu item', 'error');
		} finally {
			setDeleteLoading(false);
			setDeleteId(null);
		}
	};

	return (
		<Container sx={{ py: 4 }}>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
				<Typography variant="h4" sx={{ fontWeight: 800 }}>Manage Menu Items</Typography>
				<Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
					<FormControl size="small" sx={{ minWidth: 240 }}>
						<InputLabel id="restaurant-label">Restaurant</InputLabel>
						<Select labelId="restaurant-label" value={selectedRestaurant} label="Restaurant" onChange={(e) => setSelectedRestaurant(e.target.value)}>
							{restaurants.map(r => <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>)}
						</Select>
					</FormControl>
					<Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate} disabled={!selectedRestaurant}>Add Item</Button>
				</Box>
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
								<TableCell>Price</TableCell>
								<TableCell>Category</TableCell>
								<TableCell>Available</TableCell>
								<TableCell align="right">Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{items.map((m) => (
								<TableRow key={m.id} hover>
									<TableCell>{m.name}</TableCell>
									<TableCell>₹{m.price}</TableCell>
									<TableCell>{m.categoryName || m.categoryId}</TableCell>
									<TableCell>{m.available ? 'Yes' : 'No'}</TableCell>
									<TableCell align="right">
										<IconButton size="small" onClick={() => handleOpenEdit(m)}><EditIcon /></IconButton>
										<IconButton size="small" color="error" onClick={() => handleDelete(m.id)} disabled={deleteLoading && deleteId === m.id}>
											{deleteLoading && deleteId === m.id ? <CircularProgress size={18} /> : <DeleteIcon />}
										</IconButton>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			)}

			<Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
				<DialogTitle>{editingId ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
				<DialogContent>
					<Box sx={{ mt: 1 }}>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<TextField fullWidth label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={!!formErrors.name} helperText={formErrors.name} required />
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField fullWidth type="number" label="Price (₹)" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} error={!!formErrors.price} helperText={formErrors.price} required />
							</Grid>
							<Grid item xs={12}>
								<TextField fullWidth label="Description" multiline rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} error={!!formErrors.description} helperText={formErrors.description} required />
							</Grid>
							<Grid item xs={12} sm={6}>
								<FormControl fullWidth>
									<InputLabel id="rest-select">Restaurant</InputLabel>
									<Select labelId="rest-select" value={form.restaurantId} label="Restaurant" onChange={(e) => setForm({ ...form, restaurantId: e.target.value })} error={!!formErrors.restaurantId}>
										{restaurants.map(r => <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>)}
									</Select>
								</FormControl>
								{formErrors.restaurantId && <Typography variant="caption" color="error">{formErrors.restaurantId}</Typography>}
							</Grid>
							<Grid item xs={12} sm={6}>
								<FormControl fullWidth>
									<InputLabel id="cat-select">Category</InputLabel>
									<Select labelId="cat-select" value={form.categoryId} label="Category" onChange={(e) => setForm({ ...form, categoryId: e.target.value })} error={!!formErrors.categoryId}>
										{categories.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
									</Select>
								</FormControl>
								{formErrors.categoryId && <Typography variant="caption" color="error">{formErrors.categoryId}</Typography>}
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField fullWidth label="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField fullWidth type="number" label="Preparation Time (mins)" value={form.preparationTime} onChange={(e) => setForm({ ...form, preparationTime: Number(e.target.value) })} error={!!formErrors.preparationTime} helperText={formErrors.preparationTime} />
							</Grid>
							<Grid item xs={12} sm={4}>
								<FormControlLabel control={<Switch checked={!!form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} />} label="Available" />
							</Grid>
							<Grid item xs={12} sm={4}>
								<FormControlLabel control={<Switch checked={!!form.vegetarian} onChange={(e) => setForm({ ...form, vegetarian: e.target.checked })} />} label="Vegetarian" />
							</Grid>
							<Grid item xs={12} sm={4}>
								<FormControlLabel control={<Switch checked={!!form.spicy} onChange={(e) => setForm({ ...form, spicy: e.target.checked })} />} label="Spicy" />
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

export default AdminMenuItems;