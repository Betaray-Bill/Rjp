import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    projectName: {
        type: String
    },
    projectOwner: {
        type: String
    },
    company: {
        name: {
            type: String
        },
        Company_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company'
        }
    },
    contactDetails: {
        // type: mongoose.Schema.Types.ObjectId, ref: 'CompanyContact'
        name: {
            type: String
        },
        email: {
            type: String
        },
        contactNumber: {
            type: String
        }
    },
    amount: {
        type: Number
    },
    domain: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    trainingDates: {
        startDate: Date,
        endDate: Date,
        timing: String
    },
    modeOfTraining: {
        type: String,
        enum: ['Virtual', 'In-Person']
    },
    employees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    }],
    trainers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trainer'
    }]
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);
export default Project;