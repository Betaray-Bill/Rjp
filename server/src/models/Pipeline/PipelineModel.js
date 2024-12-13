import mongoose from "mongoose";
import { stages } from "../../utils/constants.js";

const stageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }]
});


// Define the main pipeline schema
const pipelineSchema = new mongoose.Schema({
    stages: {
        type: [stageSchema],
        default: [{
            name: stages.TRAINING_ENQUIRY,
            projects: []
        }, {
            name: stages.REPLY,
            projects: []
        }, {
            name: stages.PROPOSAL_SENT,
            projects: []
        }, {
            name: stages.PO_RECEIVED_OR_INVOICE_RAISED,
            projects: []
        }, {
            name: stages.TRAINING_DELIVERY,
            projects: [],

        }, {
            name: stages.INVOICE_SENT,
            projects: []
        }, {
            name: stages.PAYMENT,
            projects: []
        }]
    }
});
pipelineSchema.statics.getSingletonPipeline = async function() {
    let pipeline = await this.findOne();
    if (!pipeline) {
        pipeline = await this.create({});
    }
    return pipeline;
};


const Pipeline = mongoose.model('Pipeline', pipelineSchema);

async function getOrCreatePipeline() {
    try {
        const pipeline = await Pipeline.getSingletonPipeline();
        // console.log('Pipeline:', pipeline);
        return pipeline;
    } catch (error) {
        console.error('Error accessing pipeline:', error);
    }
}
getOrCreatePipeline();

export default Pipeline;