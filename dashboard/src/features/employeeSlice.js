import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    allEmployee: [],
};

const employeeSlice = createSlice({
    name: 'employee',
    initialState,
    reducers: {
        setAllEmp: (state, action) => {
            state.allEmployee = action.payload
        },
    },
});

export const {
    setAllEmp
} = employeeSlice.actions;

export default employeeSlice.reducer;