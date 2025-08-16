import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  restaurantId: null,
  total: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { item, restaurantId } = action.payload;
      
      // If adding to a different restaurant, clear cart
      if (state.restaurantId && state.restaurantId !== restaurantId) {
        state.items = [];
        state.total = 0;
      }
      
      state.restaurantId = restaurantId;
      
      const existingItem = state.items.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }
      
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    
    removeFromCart: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter(item => item.id !== itemId);
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      if (state.items.length === 0) {
        state.restaurantId = null;
      }
    },
    
    updateQuantity: (state, action) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find(item => item.id === itemId);
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.id !== itemId);
        } else {
          item.quantity = quantity;
        }
      }
      
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      if (state.items.length === 0) {
        state.restaurantId = null;
      }
    },
    
    clearCart: (state) => {
      state.items = [];
      state.restaurantId = null;
      state.total = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;