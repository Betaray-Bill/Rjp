import mongoose from "mongoose";




const stageSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        enum: [
            'Training Requirement',
            'Reply',
            'Proposal Sent',
            'PO received / Invoice Raised',
            'Training Delivery',
            'Invoice Sent',
            'Payment'
        ],
    }, // No enum; free text
    projects: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
});

const Stages = mongoose.model('Stages', stageSchema);

export default Stages;