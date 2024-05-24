import { createSlice, PayloadAction } from '@reduxjs/toolkit';


export interface CartItem {
  productId: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};



const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      const itemIndex = state.items.findIndex(item => item.productId === action.payload.productId);
  
      if (itemIndex !== -1) {
        state.items[itemIndex].quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    loadCartSuccess(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(item => item.productId !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
  
});

export const { addItem, loadCartSuccess, removeItem, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
