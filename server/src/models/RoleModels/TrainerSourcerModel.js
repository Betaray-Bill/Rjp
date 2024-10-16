import mongoose from "mongoose";


const trainerSourcerSchema = new mongoose.Schema({
    registeredTrainers: [{
        type: String
    }]
});

const TrainerSourcer = mongoose.model('TrainerSourcer', trainerSourcerSchema);
export default TrainerSourcer