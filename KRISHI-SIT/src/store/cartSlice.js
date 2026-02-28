// /src/store/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const existing = state.cartItems.find(item => item.id === action.payload.id);
      if (existing) {
        existing.qty += 1;
      } else {
        state.cartItems.push({ ...action.payload, qty: 1 });
      }
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(item => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.cartItems = [];
    },
    // ← Added this reducer to allow updating quantity
    updateQuantity: (state, action) => {
      const { id, qty } = action.payload;
      const item = state.cartItems.find(i => i.id === id);
      if (item) {
        item.qty = qty;
      }
    },
  },
});

// Export all actions including the new one
export const { addToCart, removeFromCart, clearCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;
