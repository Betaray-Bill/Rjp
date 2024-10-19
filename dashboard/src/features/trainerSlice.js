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
        trainingDomain: [{
            domain: "",
            price: Number(),
            paymentSession: ""
        }],
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
            state.trainerDetails = {...state.trainerDetails, [action.payload.name]: {...action.payload.data } }
        },

    },
});

export const {
    setResumeDetails
} = trainerSlice.actions;

export default trainerSlice.reducer;