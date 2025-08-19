import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from './store/store';

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
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
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
    }
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#282c3f',
          borderBottom: '1px solid rgba(40,44,63,0.12)'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 10,
          paddingInline: 18,
          height: 42,
          boxShadow: '0 2px 6px rgba(252,128,25,0.15)',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 8px 18px rgba(252,128,25,0.25)'
          }
        },
        containedPrimary: {
          color: '#fff'
        }
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          overflow: 'hidden',
          transition: 'transform 200ms ease, box-shadow 200ms ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 28px rgba(0,0,0,0.12)'
          }
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: '#f0f0f3',
        }
      }
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffe8d6',
          color: '#fc8019'
        }
      }
    }
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className="App">
            <Header />
            <main style={{ paddingTop: '64px', minHeight: 'calc(100vh - 64px)' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/restaurant/:id" element={<RestaurantDetail />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/orders/:id" element={<OrderDetail />} />
                </Route>
              </Routes>
            </main>
          </div>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
