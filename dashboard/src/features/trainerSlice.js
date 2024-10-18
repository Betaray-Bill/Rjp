import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    trainerDetails: {

    },
};

const trainerSlice = createSlice({
    name: 'trainer',
    initialState,
    reducers: {
        setResumeDetails: (state, action) => {
            state.trainerDetails = {...state.trainerDetails, ...action.payload }
        },

    },
});

export const {
    setResumeDetails
} = trainerSlice.actions;

export default trainerSlice.reducer;