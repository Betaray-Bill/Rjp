import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const trainerSchema = mongoose.Schema({
    generalDetails: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        },
        whatsappNumber: {
            type: String
        },
        alternateNumber: {
            type: String
        }
    },
    bankDetails: {
        accountName: {
            type: String,
            required: true
        },
        accountNumber: {
            type: String,
            required: true
        },
        bankName: {
            type: String,
            required: true
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
            required: true
        },
        modeOfTraining: {
            type: String
        }
    },
    trainingDomain: [{
        domain: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        paymentSession: {
            type: String,
            enum: [
                'Online Hourly', 'Online Per-day', 'Offline Hourly', 'Offline Per Day'
            ],
            required: true
        }
    }],
    mainResume: {
        professionalSummary: [{
            type: String
        }],
        technicalSkills: [{
            type: String
        }],
        careerHistory: [{
            type: String
        }],
        certifications: [{
            type: String
        }],
        education: [{
            type: String
        }],
        trainingsDelivered: [{
            type: String
        }],
        clientele: [{
            type: String
        }],
        experience: [{
            type: String
        }]
    },
    resumeVersions: [{
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
            type: String
        }, // Training name for version
    }],
    // Other information like NDA, Trainer Who added him
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
}, { timestamps: true });

trainerSchema.index({ trainingDomain: 1, trainerId: 1 })

// Match user entered password to hashed password in database
trainerSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
trainerSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// const Resume = mongoose.model('Resume', resumeSchema);
const Trainer = mongoose.model('Trainer', trainerSchema);

export { Trainer }