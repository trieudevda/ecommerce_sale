import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    user: any | null;
    isAuthenticated: boolean;
    isAppLoading: boolean;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isAppLoading: true,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAppLoading: (state, action: PayloadAction<boolean>) => {
            state.isAppLoading = action.payload;
        },
        setUser: (state, action: PayloadAction<any>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.isAppLoading = false;
        },
        setLogout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.isAppLoading = false;
        },
    },
});

export const { setUser, setLogout, setAppLoading } = authSlice.actions;
export default authSlice.reducer;