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
    copyResumeDetails: {
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
    saveResumeDetails: {
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
    downloadResume: false,
    downloadResumeName: ""
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
        },
        setCopyResumeDetails: (state, action) => {
            state.copyResumeDetails = action.payload
        },
        setSaveResumeDetails: (state, action) => {
            state.saveResumeDetails = action.payload
        },
        setIsDownload: (state, action) => {
            state.downloadResume = action.payload.bool,
                state.downloadResumeName = action.payload.name
        }
    }
});

export const {
    setCurrentResumeDetails,
    setCurrentResumeName,
    setCopyResumeDetails,
    setSaveResumeDetails,
    setIsDownload
} = resumeSlice.actions;

export default resumeSlice.reducer;