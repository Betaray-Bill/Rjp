import mongoose from "mongoose";
import Employee from "../EmployeeModel";

const trainerSourcerSchema = new mongoose.Schema({
    registeredTrainers: [{
        trainerId: mongoose.Schema.Types.ObjectId,
        ref: 'Trainer'
    }]
});

const TrainerSourcer = Employee.discriminator('TrainerSourcer', trainerSourcerSchema);
export default TrainerSourcer