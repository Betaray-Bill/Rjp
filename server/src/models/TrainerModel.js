import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const resumeSchema = mongoose.Schema({
    trainer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trainer'
    },
    professionalSummary: {
        type: [String]
    },
    technicalSkills: {
        type: [String]
    },
    careerHistory: {
        type: [String]
    },
    certifications: {
        type: [String]
    },
    education: {
        type: [String]
    },
    trainingsDelivered: {
        type: [String]
    },
    clientele: {
        type: [String]
    },
    experience: {
        type: [String]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

    trainingName: {
        name: {
            type: String
        },

    },
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'

    }],
    isMainResume: {
        type: Boolean,
        default: false
    },
    domain: {
        type: String
    },
    isLocked: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

const trainerSchema = mongoose.Schema({
    generalDetails: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        phoneNumber: {
            type: String,
            // required: true
        },
        whatsappNumber: {
            type: String
        },
        alternateNumber: {
            type: String
        },
        address: {
            flat_doorNo_street: {
                type: String,
                // required: true,
                trim: true,
            },
            area: {
                type: String,
                // required: true,
                trim: true,
            },
            townOrCity: {
                type: String,
                // required: true,
                trim: true,
            },
            state: {
                type: String,
                // required: true,
                trim: true,
            },
            pincode: {
                type: String,
                // required: true,
                //     rim: true,
                //    ?
            },
        }
    },
    bankDetails: {
        accountName: {
            type: String,
            // required: true
        },
        accountNumber: {
            type: String,
            // required: true
        },
        bankName: {
            type: String,
            // required: true
        },
        bankBranch: {
            type: String
        },
        bankIFSCCode: {
            type: String
        },
        pancardNumber: {
            type: String
        },
        aadharCardNumber: {
            type: String
        },
        gstNumber: {
            type: String
        },
        panCard: {
            type: String
        },
        aadharCard: {
            type: String
        },
        vendorName: {
            type: String
        }
    },
    trainingDetails: {
        trainerType: {
            type: String,
            // enum: [
            //     'Internal', 'External'
            // ],
            // required: true
        },
        modeOfTraining: {
            type: String
        }
    },
    trainingDomain: [{
        domain: {
            type: String,
            // required: true
        },
        price: {
            type: Number,
            // required: true
        },
        paymentSession: {
            type: String,
            // enum: [
            //     'Online Hourly', 'Online Per-day', 'Offline Hourly', 'Offline Per-Day'
            // ],
            // required: true
        },
        type: {
            type: String,
            // required: true
        }
    }],
    resumeVersion: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resume'
    }],
    trainer_sourcer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TrainerSourcer'
    },
    trainerId: {
        type: String,
        unique: true
    },
    password: {
        // required: true,
        type: String
    },
    is_FirstLogin: {
        type: Boolean,
        default: true
    },
    nda_Accepted: {
        type: Boolean,
        default: false
    },
    Rating: {
        star: {
            type: Number,
            default: 0
        },
        Remarks: [{
            name: String,
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            },
            description: String,
            date: Date
        }]
    },
    workingDates: [{
        name: {
            type: String,
            // required: true,
        },
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project'
        },
        startDate: {
            type: Date,
            // required: true,
        },
        endDate: {
            type: Date,
            // required: true,
        },
        startTime: {
            type: String, // e.g., "09:00 AM"
            // required: true,
        },
        endTime: {
            type: String, // e.g., "05:00 PM"
            // required: true,
        },
        // specialTimings: [{
        //     date: {
        //         type: Date,
        //         // required: true,
        //     },
        //     startTime: {
        //         type: String, // e.g., "09:00 AM"
        //         // required: true,
        //     },
        //     endTime: {
        //         type: String, // e.g., "05:00 PM"
        //         // required: true,
        //     },

        // }],
    }],
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }]
}, { timestamps: true });

trainerSchema.index({ trainingDomain: 1, trainerId: 1 })



const Resume = mongoose.model('Resume', resumeSchema);
const Trainer = mongoose.model('Trainer', trainerSchema);

export { Trainer, Resume }