import mongoose from "mongoose";

// Notes Schema
const notesSchema = new mongoose.Schema({
    text: {
        content: {
            type: String,
            default: ''
        }
    },
    file: {
        url: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: ''
        }
    },
    sent: {
        type: String,
        default: '' // Adjust based on expected data type, e.g., Boolean or Date, if applicable.
    },
    timestamps: {
        type: Date,
        default: Date.now
    },
    photo_url: {
        type: String,
        default: 'https://example.com/photos/alice.jpg'
    }
})

// Project Schema
const projectSchema = new mongoose.Schema({
    projectName: {
        type: String
    },
    projectOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
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
    // trainers: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Trainer'
    // }]

    trainers: [{
        trainer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Trainer'
        },
        resume: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Resume'
        }
    }],
    notes: [notesSchema],
    stages: {
        type: String,

    }
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);
export default Project;