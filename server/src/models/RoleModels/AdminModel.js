import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    manageEmployees: {
        type: Boolean,
        default: true
    }
});

const Admin = mongoose.model('ADMIN', adminSchema);
export default Admin;