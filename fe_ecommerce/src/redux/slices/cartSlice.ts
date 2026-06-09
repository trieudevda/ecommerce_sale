// src/redux/slices/cartSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface Product { id: string; name: string; price: number; image: string; }

const cartSlice = createSlice({
    name: 'cart',
    initialState: { items: [] as Product[] },
    reducers: {
        addToCart: (state, action: PayloadAction<Product>) => {
            state.items.push(action.payload);
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item.id !== action.payload);
        }
    }
});

export const { addToCart, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;