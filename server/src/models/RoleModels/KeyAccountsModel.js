import mongoose from "mongoose";
import Employee from "../EmployeeModel.js";

const KeyAccountsSchema = new mongoose.Schema({
    registeredTrainers: [{
        trainerId: mongoose.Schema.Types.ObjectId,
        ref: 'Trainer'
    }]
});

const KeyAccounts = Employee.discriminator('KeyAccounts', KeyAccountsSchema);
export default KeyAccounts