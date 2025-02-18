import mongoose from "mongoose";
import { stages } from "../../utils/constants.js";

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

// Remainder Schema
const remainderSchema = new mongoose.Schema({
    // remainders: [{
    date: {
        type: Date,
        // default: Date.now
    },
    stages: {
        type: String,
        default: '',
        // enum: Object.values(stages)
    },
    description: {
        type: String,
        default: ''
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    // }],
}, { timestamps: true })

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
        startDate: {
            type: Date,
            // required: true
        },
        endDate: {
            type: Date,
            // required: true
        },
        startTime: {



            type: String, // e.g., "09:00 AM"
            // required: true
        },
        endTime: {
            type: String, // e.g., "05:00 PM"
            // required: true
        },
        specialTimings: [{
            date: {
                type: Date,
                // required: true
            },
            startTime: {
                type: String, // e.g., "09:00 AM"
                // required: true
            },
            endTime: {
                type: String, // e.g., "05:00 PM"
                // required: true
            }
        }]
    },
    remainders: [remainderSchema],
    clientDetails: {
        invoiceSentClient: {
            type: Boolean,
            default: false
        },
        amount: {
            type: Number
        },
        dueDate: {
            type: Date
        }
    },
    modeOfTraining: {
        type: String,
        enum: ['Virtual', 'In-Person', 'Hybrid']
    },
    // trainers: [{     type: mongoose.Schema.Types.ObjectId,     ref: 'Trainer' }],
    trainers: [{
        trainingDates: {
            startDate: {
                type: Date,
                // required: true
            },
            endDate: {
                type: Date,
                // required: true
            }
        },
        trainer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Trainer'
        },
        resume: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Resume'
        },
        purchaseOrder: [{
            // isPO_generated: false,
            poNumber: Number,
            isAccepted: {
                type: Boolean,
                default: false
            },
            isDeclined: {
                type: Boolean,
                default: false
            },
            declineReason: {
                type: String
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
                        // required: true
                    },
                    hsnSac: {
                        type: String,
                        // required: true
                    },
                    typeQty: {
                        type: Number,
                        // required: true
                    },
                    rate: {
                        type: Number,
                        // required: true
                    },
                    amount: {
                        type: Number,
                        // required: true
                    }
                }],
                type: {
                    type: String
                },
                terms: [{
                    type: String
                }],
                purchaseorderNumber: {
                    type: String
                }
            }
        }],
        isClientCallDone: {
            type: Boolean,
            default: false, // Default to `false`
        },
        isFinalized: {
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
            isPaid: {
                type: Boolean,
                default: false
            },
            description: {
                type: String
            },
            dueDate: {
                type: Date
            }
        }]
    }],
    notes: [notesSchema],
    stages: {
        type: String
    },
    isLost: {
        type: Boolean,
        default: false
    },
    lost_won_open_status: {
        type: String,
        enum: ['lost', 'won', 'open']
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
    expenses: {
        Trainer: {
            amount: {
                type: Number
            },
            dueDate: {
                type: Date
            },
            isPaid: {
                type: Boolean,
                default: false
            }
        },
        Venue: {
            amount: {
                type: Number
            },
            dueDate: {
                type: Date
            },
            isPaid: {
                type: Boolean,
                default: false
            }
        },
        Travel: {
            amount: {
                type: Number
            },
            dueDate: {
                type: Date
            },
            isPaid: {
                type: Boolean,
                default: false
            }
        },
        Boarding_Lodging: {
            amount: {
                type: Number
            },
            dueDate: {
                type: Date
            },
            isPaid: {
                type: Boolean,
                default: false
            }
        },
        cw_lab: {
            amount: {
                type: Number
            },
            dueDate: {
                type: Date
            },
            isPaid: {
                type: Boolean,
                default: false
            }
        },
        miscellaneous: {
            amount: {
                type: Number
            },
            dueDate: {
                type: Date
            },
            isPaid: {
                type: Boolean,
                default: false
            }
        }
    }
    // required: function() {     return this.stages === "Training Delivery" }
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);
export default Project;