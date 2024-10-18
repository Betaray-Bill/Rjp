import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentUser: null,
};

const trainerSlice = createSlice({
    name: 'trainer',
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
} = trainerSlice.actions;

export default trainerSlice.reducer;