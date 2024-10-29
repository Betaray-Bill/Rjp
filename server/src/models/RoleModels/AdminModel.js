import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    manageEmployees: {
        type: Boolean,
        default: true
    },
    registeredTrainers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trainer'
    }]
});

const Admin = mongoose.model('ADMIN', adminSchema);
export default Admin;