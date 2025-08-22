import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, CircularProgress, Alert } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import api from '../api/client';
import { useToast } from '../components/ToastProvider';

const emptyForm = { name: '', description: '', imageUrl: '' };

const AdminCategories = () => {
	const { showToast } = useToast();
	const [categories, setCategories] = useState([]);
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
			const res = await api.get('/categories');
			setCategories(res.data || []);
		} catch (e) {
			setError(e?.message || 'Failed to load categories');
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

	const handleOpenEdit = (c) => {
		setForm({ name: c.name || '', description: c.description || '', imageUrl: c.imageUrl || '' });
		setFormErrors({});
		setEditingId(c.id);
		setDialogOpen(true);
	};

	const validate = () => {
		const errors = {};
		if (!form.name.trim()) errors.name = 'Category name is required';
		else if (form.name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
		if (!form.description.trim()) errors.description = 'Description is required';
		else if (form.description.trim().length < 5) errors.description = 'Description must be at least 5 characters';
		setFormErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleSave = async () => {
		if (!validate()) return;
		setSaving(true);
		setFormErrors({});
		try {
			if (editingId) {
				await api.put(`/categories/${editingId}`, form);
				showToast('Category updated', 'success');
			} else {
				await api.post('/categories', form);
				showToast('Category created', 'success');
			}
			setDialogOpen(false);
			setEditingId(null);
			await fetchAll();
		} catch (e) {
			if (e?.fieldErrors) setFormErrors(e.fieldErrors);
			showToast(e?.message || 'Failed to save category', 'error');
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async (id) => {
		setDeleteId(id);
		setDeleteLoading(true);
		try {
			await api.delete(`/categories/${id}`);
			showToast('Category deleted', 'success');
			await fetchAll();
		} catch (e) {
			showToast(e?.message || 'Failed to delete category', 'error');
		} finally {
			setDeleteLoading(false);
			setDeleteId(null);
		}
	};

	return (
		<Container sx={{ py: 4 }}>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
				<Typography variant="h4" sx={{ fontWeight: 800 }}>Manage Categories</Typography>
				<Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>Add Category</Button>
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
								<TableCell>Description</TableCell>
								<TableCell>Image</TableCell>
								<TableCell align="right">Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{categories.map((c) => (
								<TableRow key={c.id} hover>
									<TableCell>{c.name}</TableCell>
									<TableCell>{c.description}</TableCell>
									<TableCell>{c.imageUrl ? <img src={c.imageUrl} alt={c.name} style={{ width: 48, height: 32, objectFit: 'cover' }} /> : '-'}</TableCell>
									<TableCell align="right">
										<IconButton size="small" onClick={() => handleOpenEdit(c)}><EditIcon /></IconButton>
										<IconButton size="small" color="error" onClick={() => handleDelete(c.id)} disabled={deleteLoading && deleteId === c.id}>
											{deleteLoading && deleteId === c.id ? <CircularProgress size={18} /> : <DeleteIcon />}
										</IconButton>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			)}

			<Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
				<DialogTitle>{editingId ? 'Edit Category' : 'Add Category'}</DialogTitle>
				<DialogContent>
					<Box sx={{ mt: 1 }}>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<TextField fullWidth label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={!!formErrors.name} helperText={formErrors.name} required />
							</Grid>
							<Grid item xs={12}>
								<TextField fullWidth label="Description" multiline rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} error={!!formErrors.description} helperText={formErrors.description} required />
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField fullWidth label="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} error={!!formErrors.imageUrl} helperText={formErrors.imageUrl} />
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

export default AdminCategories;