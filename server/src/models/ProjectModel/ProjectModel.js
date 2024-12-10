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
        },
        department: {
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
        // startDate: Date,
        // endDate: Date,
        // timingStart: String,
        // timingEnd: String

        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        startTime: {
            type: String, // e.g., "09:00 AM"
            required: true,
        },
        endTime: {
            type: String, // e.g., "05:00 PM"
            required: true,
        },
        specialTimings: [{
            date: {
                type: Date,
                required: true,
            },
            startTime: {
                type: String, // e.g., "09:00 AM"
                required: true,
            },
            endTime: {
                type: String, // e.g., "05:00 PM"
                required: true,
            },

        }],

    },
    modeOfTraining: {
        type: String,
        enum: ['Virtual', 'In-Person', 'Hybrid']
    },
    // trainers: [{     type: mongoose.Schema.Types.ObjectId,     ref: 'Trainer' }],
    trainers: [{
        trainer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Trainer'
        },
        resume: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Resume'
        },
        purchaseOrder: [{
            poNumber: Number,
            isAccepted: {
                type: Boolean,
                default: false
            },
            isDeclined: {
                type: Boolean,
                default: false
            },
            isReIssue: {
                type: Boolean,
                default: false
            },
            canSend: {
                type: Boolean,
                default: false
            },
            url: String,
            name: String,
            time: String,
            details: {
                description: [{
                    description: {
                        type: String,
                        required: true
                    },
                    hsnSac: {
                        type: String,
                        required: true
                    },
                    typeQty: {
                        type: Number,
                        required: true
                    },
                    rate: {
                        type: Number,
                        required: true
                    },
                    amount: {
                        type: Number,
                        required: true
                    }
                }],
                type: {
                    type: String
                },
                terms: [{
                    type: String
                }]
            }
        }],
        isClientCallDone: {
            type: Boolean,
            default: false, // Default to `false`
        },
        inVoice: [{
            isInvoice: {
                type: Boolean,
                default: false
            },
            InvoiceUrl: {
                type: String
            },
            inVoiceNumber: {
                type: String
            },
            inVoiceDate: {
                type: String
            },
            invoiceIndex: Number,
            isPaid: Boolean,
            description: {
                type: String
            }
        }]
    }],
    notes: [notesSchema],
    stages: {
        type: String
    },
    trainingDelivery: {
        Travel: {
            type: Boolean,
            default: false, // Default to
        },
        Hotel: {
            type: Boolean,
            default: false, // Default to
        },
        Online: {
            type: Boolean,
            default: false, // Default to
        },
        InPerson: {
            type: Boolean,
            default: false, // Default to
        },
        Hybrid: {
            type: Boolean,
            default: false, // Default to
        },
        FullTime: {
            type: Boolean,
            default: false, // Default to
        },
        fullTime_start: {
            type: String, // Default to
        },
        fullTime_end: {
            type: String, // Default to
        },
        partTime_start: {
            type: String, // Default to
        },
        partTime_end: {
            type: String, // Default to
        },
        PartTime: {
            type: Boolean,
            default: false, // Default to
        },
        venue: {
            type: Boolean,
            default: false, // Default to
        },
        PO_Payment_terms: {
            type: Boolean,
            default: false, // Default to
        },
        NDA_SignedCollection: {
            type: Boolean,
            default: false, // Default to
        },
        Pre_Req_Test: {
            type: Boolean,
            default: false, // Default to
        },
        Ref_Material_links__Training_content__Lab_testing__Azure_pass: {
            type: Boolean,
            default: false, // Default to
        },
        Day_wise_Training_Content: {
            type: Boolean,
            default: false, // Default to
        },
        ParticipantList: {
            type: Boolean,
            default: false, // Default to
        },
        whitelisting: {
            type: Boolean,
            default: false, // Default to
        },
        WhatsAppGroupCreation: {
            type: Boolean,
            default: false, // Default to
        },

        MeetingInvite: {
            type: Boolean,
            default: false, // Default to
        },
        LMSInvite: {
            type: Boolean,
            default: false, // Default to
        },
        LabDetails: {
            type: Boolean,
            default: false, // Default to
        },
        All_Reports_Mailed: {
            type: Boolean,
            default: false, // Default to
        },

        FB_MTM: {
            type: Boolean,
            default: false, // Default to
        },
        certificate_Issued: {
            type: Boolean,
            default: false, // Default to
        }

    },
    // required: function() {     return this.stages === "Training Delivery" }
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);
export default Project;