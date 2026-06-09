import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer
    },
});

// Xuất các kiểu dữ liệu để dùng cho TypeScript (nếu có)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;