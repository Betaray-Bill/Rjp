import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    trainerDetails: {}
};

const currentTrainerSlice = createSlice({
    name: 'currentTrainer',
    initialState,
    reducers: {
        setCurrentTrainerDetails: (state, action) => {
            console.log(action)
            state.trainerDetails = action.payload
        },
        // setCurrentTrainerProjects
    },
});

export const {
    setCurrentTrainerDetails,
} = currentTrainerSlice.actions;

export default currentTrainerSlice.reducer;