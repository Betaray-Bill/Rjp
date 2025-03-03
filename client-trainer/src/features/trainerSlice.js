import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    trainerDetails: {
        // General Details
        generalDetails: {
            name: "",
            email: "",
            phoneNumber: Number(),
            whatsappNumber: Number(),
            alternateNumber: Number(),
            dateOfBirth: Date()
        },
        // Bank Details
        bankDetails: {
            accountName: "",
            accountNumber: Number(),
            bankName: "",
            bankBranch: "",
            bankIFSCCode: "",
            pancardNumber: "",
            aadharCardNumber: "",
            gstNumber: "",
            vendorName: "",
        },
        // Training Details 
        trainingDetails: {
            trainerType: "",
            modeOfTraining: "",
        },
        //  Training Domain
        trainingDomain: [],
        // Resume Details - Main Resume
        mainResume: {
            professionalSummary: [],
            technicalSkills: [],
            careerHistory: [],
            certifications: [],
            education: [],
            trainingsDelivered: [],
            clientele: [],
            experience: [],
        }
    },
};

const trainerSlice = createSlice({
    name: 'trainer',
    initialState,
    reducers: {
        setResumeDetails: (state, action) => {
            console.log(action)
            if (action.payload.name === 'trainingDomain') {
                state.trainerDetails[action.payload.name] = action.payload.data
            } else {
                state.trainerDetails = {...state.trainerDetails, [action.payload.name]: {...action.payload.data } }
            }
        },
        removeResumeDetails: (state) => {
            state.trainerDetails = {
                generalDetails: {
                    name: "",
                    email: "",
                    phoneNumber: Number(),
                    whatsappNumber: Number(),
                    alternateNumber: Number(),
                },
                bankDetails: {
                    accountName: "",
                    accountNumber: Number(),
                    bankName: "",
                    bankBranch: "",
                    bankIFSCCode: "",
                    pancardNumber: "",
                    aadharCardNumber: "",
                    gstNumber: "",
                    vendorName: "",
                },
                trainingDetails: {
                    trainerType: "",
                    modeOfTraining: "",
                },
                trainingDomain: [],
                mainResume: {
                    professionalSummary: [],
                    technicalSkills: [],
                    careerHistory: [],
                    certifications: [],
                    education: [],
                    trainingsDelivered: [],
                    clientele: [],
                    experience: [],
                }
            }
        }

    },
});

export const {
    setResumeDetails,
    removeResumeDetails
} = trainerSlice.actions;

export default trainerSlice.reducer;