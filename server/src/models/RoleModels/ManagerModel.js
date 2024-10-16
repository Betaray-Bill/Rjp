import mongoose from "mongoose";

const managerSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
    },
    deals: [{
        type: mongoose.Schema.Types.ObjectId,
        // ref: 'Employee',
    }],

});

const Manager = mongoose.model('Manager', managerSchema);

export default Manager;