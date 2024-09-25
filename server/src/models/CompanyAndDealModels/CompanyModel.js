import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    contact_details: {
        contact_name: {
            type: String,
            required: true
        },
        contact_email: {
            type: String,
            required: true
        },
        contact_phone_number: {
            type: Number,
            required: true
        }
    },
    // Deals: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Deal'
    // }]
}, {
    timestamps: true,
})


const Company = mongoose.model('Company', companySchema);

export default Company