import mongoose from "mongoose";

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
            name: 'Training Requirement',
            projects: []
        }, {
            name: 'Reply',
            projects: []
        }, {
            name: 'Proposal Sent',
            projects: []
        }, {
            name: 'PO received / Invoice Raised',
            projects: []
        }, {
            name: 'Training Delivery',
            projects: [],

        }, {
            name: 'Invoice Sent',
            projects: []
        }, {
            name: 'Payment',
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