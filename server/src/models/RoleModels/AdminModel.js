import mongoose from "mongoose";
import Employee from "../EmployeeModel.js";

const adminSchema = new mongoose.Schema({
    manageEmployees: {
        type: Boolean,
        default: true
    }
});

const Admin = Employee.discriminator('ADMIN', adminSchema);
export default Admin;