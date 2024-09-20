import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


const trainerSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type_of_trainer: {
        type: String,
        required: true,
        enum: ['Internal', 'External']
    },
    trainer_sourcer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TrainerSourcer'
    },
    is_FirstLogin: {
        type: Boolean,
        default: true
    },
    nda_Accepted: {
        type: Boolean,
        default: false
    },
    // Bank Details--------------------------------
    bank_Details: {
        account_Name: {
            type: String,
            required: true
        },
        account_Number: {
            type: Number,
            required: true
        },
        bank_Branch: {
            type: String,
            required: true
        },
        bank_IFSC_code: {
            type: String,
            required: true
        },
        pancard_Number: {
            type: String,
            required: true
        },
        aadharcard_number: {
            type: String,
            required: true
        }
    },
    // Contact Details--------------------------------
    contact_Details: {
        mobile_number: {
            type: String,
            required: true
        },
        email_id: {
            type: String,
            required: true
        },
        alternate_contact_number: {
            type: String
        },
        alternate_email_id: {
            type: String
        }
    },
    trainerId: {
        type: String,
        unique: true
    },
    trainer_password: {
        type: String,
        required: true
    },
    availableDate: {
        type: [{
            startDate: {
                type: Date
            },
            endDate: {
                type: Date
            }
        }]
    }
    // Resume Details--------------------------------

}, {
    timestamps: true,
});

// Match user entered password to hashed password in database
trainerSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.trainer_password);
};

// Encrypt password using bcrypt
userSchema.pre('save', async function(next) {
    if (!this.isModified('trainer_password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.trainer_password, salt);
});

const Trainer = mongoose.model('Trainer', trainerSchema);

export default Trainer;