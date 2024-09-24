import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentUser: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {

        setCredentials: (state, action) => {
            state.currentUser = action.payload
        },
        signOut: (state) => {
            state.currentUser = null;
        },
    },
});

export const {
    setCredentials,
    signOut
} = authSlice.actions;

export default authSlice.reducer;