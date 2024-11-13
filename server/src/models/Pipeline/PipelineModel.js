import mongoose from "mongoose";

const pipelineSchema = new mongoose.Schema({
    projects: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },

});

const Pipeline = mongoose.model('Pipeline', pipelineSchema);

export default Pipeline;