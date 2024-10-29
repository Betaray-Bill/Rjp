import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    projectName: {
        type: String,
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
    domain: {
        type: String,
        required: true
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
    employee: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    }],
    trainers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trainer'
    }]
}, {
    timestamps: true,
});

const Project = mongoose.model('Project', projectSchema);
export default Project;