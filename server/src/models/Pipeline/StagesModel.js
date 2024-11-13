import mongoose from "mongoose";

const stageSchema = new mongoose.Schema({
    projects: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },

});

const Stages = mongoose.model('Stages', stageSchema);

export default Stages;