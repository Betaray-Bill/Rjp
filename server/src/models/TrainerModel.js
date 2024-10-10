import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


const trainerSchema = mongoose.Schema({
    name: {
        type: String,
        // required: true,
    },
    type_of_trainer: {
        type: String,
    },
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
        type: String,
    },
    is_FirstLogin: {
        type: Boolean,
        default: true
    },
    nda_Accepted: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        default: 0
    },
    price: {
        amount: {
            type: Number,
            default: 0
        },
        type: {
            type: String
        }
    },
    training_mode: {
        type: String,
        enum: ['Full Time', 'Part Time', 'Online', 'Offline']
    },
    // Bank Details--------------------------------
    bank_Details: {
        account_Name: {
            type: String,
            // required: true
        },
        account_Number: {
            type: Number,
            // required: true
        },
        bank_Branch: {
            type: String,
            // required: true
        },
        bank_IFSC_code: {
            type: String,
            // required: true
        },
        pancard_Number: {
            type: String,
            // required: true
        }
    },
    // Contact Details--------------------------------
    contact_Details: {
        mobile_number: {
            type: String,
            // required: true
        },
        email_id: {
            type: String,
            // required: true
        },
        whatsapp_number: {
            type: String
        }
    },

    availableDate: {
        type: [{
            start: {
                type: Date
            },
            end: {
                type: Date
            },
            title: {
                type: String
            }
        }]
    },
    // Resume Details--------------------------------
    mainResume: {
        professionalSummary: {
            type: [String]
        },
        technicalSkills: {
            type: [String],
        },
        careerHistory: {
            type: [String],
        },
        certifications: {
            type: [String],
        },
        education: {
            type: [String],
        },
        trainingsDelivered: {
            type: [String],
        },
        clientele: {
            type: [String],
        },
        experience: {
            type: [String],
        },
        createdAt: {
            type: Date,
            default: Date.now,
        }
    },
    resumeVersions: [{
        professionalSummary: {
            type: [String]
        },
        technicalSkills: {
            type: [String],
        },
        careerHistory: {
            type: [String],
        },
        certifications: {
            type: [String],
        },
        education: {
            type: [String],
        },
        trainingsDelivered: {
            type: [String],
        },
        clientele: {
            type: [String],
        },
        experience: {
            type: [String],
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        trainingName: {
            type: String,
        }, // Training name for version
    }]

}, {
    timestamps: true,
});


// Resume Schema
const resumeSchema = new mongoose.Schema({
    professionalSummary: {
        type: [String]
    },
    technicalSkills: {
        type: [String],
    },
    careerHistory: {
        type: [String],
    },
    certifications: {
        type: [String],
    },
    education: {
        type: [String],
    },
    trainingsDelivered: {
        type: [String],
    },
    clientele: {
        type: [String],
    },
    experience: {
        type: [String],
    },
    file_url: {
        type: String,
        // required: true
    }
}, {
    timestamps: true,
});

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