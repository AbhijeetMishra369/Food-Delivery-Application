import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

const ToastContext = createContext({ showToast: () => {} });

export const ToastProvider = ({ children }) => {
	const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });
	
	const showToast = useCallback((message, severity = 'info') => {
		setToast({ open: true, message, severity });
	}, []);
	
	const handleClose = () => setToast((t) => ({ ...t, open: false }));
	
	const value = useMemo(() => ({ showToast }), [showToast]);
	
	return (
		<ToastContext.Provider value={value}>
			{children}
			<Snackbar open={toast.open} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
				<Alert onClose={handleClose} severity={toast.severity} sx={{ width: '100%' }}>
					{toast.message}
				</Alert>
			</Snackbar>
		</ToastContext.Provider>
	);
};

export const useToast = () => useContext(ToastContext);

export default ToastProvider;