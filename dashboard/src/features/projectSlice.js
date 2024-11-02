import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    project: {
        projectName: "",
        projectOwner: "",
        company: {
            name: "",
            Company_id: null, // Assuming it will be populated with an ObjectId when linked to a Company
        },
        contactDetails: {
            name: "",
            email: "",
            contactNumber: "",
        },
        amount: 0,
        domain: "",
        description: "",
        trainingDates: {
            startDate: null,
            endDate: null,
            timing: "",
        },
        modeOfTraining: "", // Either 'Virtual' or 'In-Person'
        employees: [], // Array of employee ObjectIds
        trainers: [], // Array of trainer ObjectIds
    },
};

const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {

        setCredentials: (state, action) => {
            console.log(action.payload)
            state.project = {...state.project, ...action.payload }
        },
        removeCredential: (state) => {
            state.project = null;
        },
    },
});

export const {
    setCredentials,
    removeCredential
} = projectSlice.actions;

export default projectSlice.reducer;