import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            console.log(action.payload)
            state.user = action.payload.trainer;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            console.log(state.user)
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        },
    }
});

export const {
    setCredentials,
    logout
} = authSlice.actions;

export default authSlice.reducer;