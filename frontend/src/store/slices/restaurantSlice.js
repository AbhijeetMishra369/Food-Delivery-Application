import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

// Async thunks
export const fetchRestaurants = createAsyncThunk(
  'restaurant/fetchRestaurants',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/restaurants`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch restaurants');
    }
  }
);

export const fetchRestaurantById = createAsyncThunk(
  'restaurant/fetchRestaurantById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/restaurants/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch restaurant');
    }
  }
);

export const searchRestaurants = createAsyncThunk(
  'restaurant/searchRestaurants',
  async (query, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/restaurants/search?q=${query}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to search restaurants');
    }
  }
);

// Paginated fetch for infinite scroll
export const fetchRestaurantsPage = createAsyncThunk(
  'restaurant/fetchRestaurantsPage',
  async ({ page = 0, size = 9 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/restaurants/page?page=${page}&size=${size}`);
      // Spring Data page format has `content`; if not, fallback to array
      const payload = Array.isArray(response.data) ? { content: response.data, last: true, number: page } : response.data;
      return payload;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch restaurants page');
    }
  }
);

const initialState = {
  restaurants: [],
  currentRestaurant: null,
  loading: false,
  error: null,
  page: 0,
  hasMore: true,
  appending: false,
};

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentRestaurant: (state) => {
      state.currentRestaurant = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch restaurants
      .addCase(fetchRestaurants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurants = action.payload;
        state.page = 0;
        state.hasMore = true;
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch restaurant by ID
      .addCase(fetchRestaurantById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurantById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRestaurant = action.payload;
      })
      .addCase(fetchRestaurantById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Search restaurants
      .addCase(searchRestaurants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchRestaurants.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurants = action.payload;
        state.page = 0;
        state.hasMore = false;
      })
      .addCase(searchRestaurants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Paginated fetch
      .addCase(fetchRestaurantsPage.pending, (state) => {
        state.appending = true;
        state.error = null;
      })
      .addCase(fetchRestaurantsPage.fulfilled, (state, action) => {
        state.appending = false;
        const { content = [], last = true, number = 0 } = action.payload || {};
        if (number === 0) {
          state.restaurants = content;
        } else {
          state.restaurants = [...state.restaurants, ...content];
        }
        state.page = number;
        state.hasMore = !last && content.length > 0;
      })
      .addCase(fetchRestaurantsPage.rejected, (state, action) => {
        state.appending = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentRestaurant } = restaurantSlice.actions;
export default restaurantSlice.reducer;