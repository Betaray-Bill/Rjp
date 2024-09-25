import asyncHandler from "../utils/asyncHandler.js";
import Trainer from "../models/TrainerModel.js";
import generateToken from "../utils/generateToken.js";


// Login - Trainer with trainerId and Trainer_password
const trainerLogin = asyncHandler(async(req, res) => {
    const { email, password } = req.body
    console.log(req.body)
    if (email === "" || password === "") {
        return res.status(400).json({ message: "Please provide both email and password." })
    }

    const trainer = await Trainer.find({ "contact_Details.email_id": email }).select("-password")
    console.log(trainer)
    if (trainer) {
        let token = generateToken(res, trainer._id);
        console.log("login token ", token);
        res.status(200).json(...trainer);
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }

})


// Accept the NDA
const acceptNDA = asyncHandler(async(req, res) => {
    // Get the Id of the Trainer
    const trainerId = req.query.trainerId

    // Check if the Trainer Exist
    const trainer = await Trainer.findByIdAndUpdate(
        trainerId, {
            nda_Accepted: true,
            is_FirstLogin: false
        }, { new: true }
    )

    try {
        await trainer.save();
        res.status(200).json({ message: 'NDA accepted successfully', trainer });
    } catch (err) {
        res.status(500).json({ message: "Error in accepting the NDA", err: err.message });
    }
})


// Rejected the NDA - Sign out


// Sign out


// Update the Profile By Trainer
const updateTrainerProfile = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        // Find the trainer by ID and update their profile
        const updatedTrainer = await Trainer.findByIdAndUpdate(
            id, { $set: updateData }, { new: true, runValidators: true }
        );

        if (!updatedTrainer) {
            return res.status(404).json({ message: "Trainer not found" });
        }

        res.status(200).json({
            message: "Trainer profile updated successfully",
            trainer: updatedTrainer
        });
    } catch (error) {
        console.error("Error updating trainer profile:", error);
        res.status(500).json({ error: "Internal server error" });
    }

})

// Accept PO 


// Reject PO 


//Raise Invoice





export {
    trainerLogin,
    acceptNDA,
    updateTrainerProfile
}