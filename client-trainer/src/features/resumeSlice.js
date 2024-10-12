import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentResumeDetails: {
        professionalSummary: [],
        technicalSkills: [],
        careerHistory: [],
        certifications: [],
        education: [],
        trainingsDelivered: [],
        clientele: [],
        experience: [],
        file_url: '',
        trainingName: ''
    },
    currentResumeName: "Main Resume",
    isAuthenticated: false,
};

const resumeSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCurrentResumeDetails: (state, action) => {
            console.log(action.payload)
            state.currentResumeDetails = action.payload
            console.log(state.currentResumeDetails)
        },
        setCurrentResumeName: (state, action) => {
            state.currentResumeName = action.payload
        }
    }
});

export const {
    setCurrentResumeDetails,
    setCurrentResumeName
} = resumeSlice.actions;

export default resumeSlice.reducer;