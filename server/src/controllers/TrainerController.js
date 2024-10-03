import asyncHandler from "../utils/asyncHandler.js";
import { Trainer } from "../models/TrainerModel.js";
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
        console.log(trainer)
        let token = generateToken(res, trainer._id);
        console.log("login token ", token);
        res.status(200).json({ trainer });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }

})


// Accept the NDA
const acceptNDA = asyncHandler(async(req, res) => {
    // Get the Id of the Trainer
    const trainerId = req.query.trainerId
    console.log(req.query.trainerId)
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

// add new Training dates
const addTrainingDates = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const trainingDates = req.body;
    console.log(trainingDates);

    // Append training dates
    const trainer = await Trainer.findByIdAndUpdate(
        id, {
            $push: {
                availableDate: {
                    startDate: new Date(trainingDates.start),
                    endDate: new Date(trainingDates.end),
                }
            }
        }, { new: true }
    )


    if (!trainer) {
        return res.status(404).json({ message: "Trainer not found" });
    }

    res.status(200).json({
        message: "Training dates added successfully",
        trainer: trainer
    });
})

// Make a copy of the resume
const resumeCopy = asyncHandler(async(req, res) => {
    const { id } = req.params;
    console.log("Trainer Id", id)
    console.log(req.body)
        // Check if the trainer exits
    const trainer = await Trainer.findById(id);
    if (!trainer) {
        return res.status(404).json({ message: "Trainer not found" });
    }

    try {

        // save the resume's Id in the trainer's docs
        trainer.resumeVersions.push({
            professionalSummary: req.body.professionalSummary,
            technicalSkills: req.body.technicalSkills,
            careerHistory: req.body.careerHistory,
            certifications: req.body.certifications,
            education: req.body.education,
            trainingsDelivered: req.body.trainingsDelivered,
            clientele: req.body.clientele,
            experience: req.body.experience
        });
        await trainer.save();

        res.status(200).json({
            message: "Resume copy created successfully",
            trainer: trainer
        });

    } catch (err) {
        console.error("Error creating resume copy:", err);
        res.status(500).json({ error: "Internal server error" });
    }
})

// Accept PO 


// Reject PO 


//Raise Invoice


// Get Trainer by ID
const getTrainerById = asyncHandler(async(req, res) => {
    const { id } = req.params;

    try {
        const trainer = await Trainer.findById(id);
        if (!trainer) {
            return res.status(404).json({ message: "Trainer not found" });
        }
        res.status(200).json(trainer);
    } catch (err) {
        return res.status(404).json({ message: "Trainer not found" });
    }
})

// get all trainers
const getAllTrainer = asyncHandler(async(req, res) => {
    try {
        const trainers = await Trainer.find().select('-password');
        if (!trainers || trainers.length === 0) {
            return res.status(404).json({ message: "No trainers found" });
        }
        res.status(200).json(trainers);
    } catch (error) {
        console.error("Error getting all trainers:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

export {
    trainerLogin,
    acceptNDA,
    updateTrainerProfile,
    addTrainingDates,
    getTrainerById,
    getAllTrainer,
    resumeCopy
}