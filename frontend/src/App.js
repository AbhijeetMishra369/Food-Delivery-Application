import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from './store/store';
import { ToastProvider } from './components/ToastProvider';

// Components
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RestaurantDetail from './pages/RestaurantDetail';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Footer from './components/Footer';
import NotAuthorized from './pages/NotAuthorized';
import AdminRestaurants from './pages/AdminRestaurants';
import AdminCategories from './pages/AdminCategories';
import AdminMenuItems from './pages/AdminMenuItems';
import AdminOrders from './pages/AdminOrders';
import FloatingCartCTA from './components/FloatingCartCTA';

// Create theme (Swiggy-like palette & components)
const theme = createTheme({
  palette: {
    primary: {
      main: '#fc8019', // Swiggy orange
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff5200',
    },
    text: {
      primary: '#282c3f',
      secondary: '#686b78',
    },
    background: {
      default: '#f5f3f1',
      paper: '#ffffff',
    },
    divider: 'rgba(40,44,63,0.12)'
  },
  shape: {
    borderRadius: 10,
  },
  shadows: [
    'none',
    '0 2px 8px rgba(0,0,0,0.06)',
    '0 4px 14px rgba(0,0,0,0.08)',
    ...Array(22).fill('0 4px 14px rgba(0,0,0,0.08)')
  ],
  typography: {
    fontFamily: 'Inter, Roboto, Helvetica, Arial, sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10
        }
      }
    },
  }
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastProvider>
          <Router>
            <Header />
            <div style={{ paddingTop: 72, minHeight: 'calc(100vh - 72px)' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/restaurant/:id" element={<RestaurantDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
                <Route path="/admin/restaurants" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminRestaurants /></ProtectedRoute>} />
                <Route path="/admin/categories" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminCategories /></ProtectedRoute>} />
                <Route path="/admin/menu-items" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminMenuItems /></ProtectedRoute>} />
                <Route path="/admin/orders" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminOrders /></ProtectedRoute>} />
                <Route path="/not-authorized" element={<NotAuthorized />} />
              </Routes>
              <FloatingCartCTA />
            </div>
            <Footer />
          </Router>
        </ToastProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
