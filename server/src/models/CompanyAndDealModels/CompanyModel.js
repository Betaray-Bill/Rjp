import mongoose from 'mongoose';

// company contact Schema
const companyContactSchema = new mongoose.Schema({
    contactName: {
        type: String,
        required: true
    },
    contactEmail: {
        type: String,
        required: true
    },
    contactPhoneNumber: {
        type: Number,
        required: true
    },
    Projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    }],
    department: {
        type: String
    }
})

const companySchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    contact_details: [{
        type: mongoose.Types.ObjectId,
        ref: 'CompanyContact'
    }],
    Projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    }]
}, { timestamps: true })

const CompanyContact = mongoose.model('CompanyContact', companyContactSchema);
const Company = mongoose.model('Company', companySchema);

export { Company, CompanyContact }