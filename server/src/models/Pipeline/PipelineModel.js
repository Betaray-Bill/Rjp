import mongoose from "mongoose";

const pipelineSchema = new mongoose.Schema({
    Stages: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            required: true
        },
        name: {
            type: String,
            required: true
        }
    }]

});

const Pipeline = mongoose.model('Pipeline', pipelineSchema);

export default Pipeline;