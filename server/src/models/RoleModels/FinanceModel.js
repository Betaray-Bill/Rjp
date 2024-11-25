import mongoose from "mongoose";

const financeSchema = new mongoose.Schema({
    Projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    }]
});

const Finance = mongoose.model('Finance', financeSchema);
export default Finance;