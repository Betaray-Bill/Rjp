import mongoose from "mongoose";


const trainerSourcerSchema = new mongoose.Schema({
    registeredTrainers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trainer'
    }]
});

const TrainerSourcer = mongoose.model('TrainerSourcer', trainerSourcerSchema);
export default TrainerSourcer