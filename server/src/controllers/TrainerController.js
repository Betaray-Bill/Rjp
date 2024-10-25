import asyncHandler from "../utils/asyncHandler.js";
import { Trainer } from "../models/TrainerModel.js";
import { generateEmpToken, generateToken } from "../utils/generateToken.js";
import bcrypt from 'bcryptjs';


// Login - Trainer with trainerId and Trainer_password
const trainerLogin = asyncHandler(async(req, res) => {
    const { email, password } = req.body
    console.log(req.body)
    if (email === "" || password === "") {
        return res.status(400).json({ message: "Please provide both email and password." })
    }

    const trainer = await Trainer.find({ "generalDetails.email": email }).select("-password")
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
                    start: new Date(trainingDates.start),
                    end: new Date(trainingDates.end),
                    title: trainingDates.title
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
            experience: req.body.experience,
            trainingName: req.body.trainingName
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

// Change password
const changepassword = asyncHandler(async(req, res) => {
    // Get the Trainer Id and check if he exits
    const trainerId = req.params.id
    const { currentPassword, newpassword } = req.body
    console.log(currentPassword, newpassword)
    const trainer = await Trainer.findById(trainerId)
    console.log("Trainer ", trainer.generalDetails.name)
    if (!trainer) {
        res.status(404).json({
            message: 'Trainer does not exists',
        });
    }
    let a = bcrypt.compare(currentPassword, trainer.password, function(err, result) {
        // result == true
        console.log("true", result)
    })

    console.log(a)
        // get the current password and check if its legit
        // let isValid = await trainer ? .matchPassword(currentPassword)
        // console.log(isValid)
    if (trainer && (await trainer.matchPassword(currentPassword))) {
        const updatepasswordTrainer = await Trainer.findByIdAndUpdate(
            trainerId, {
                password: newpassword
            }, { new: true }
        )

        updatepasswordTrainer.save();
        res.status(200).json({ message: 'Password Cahgned Successfully', updatepasswordTrainer });
    }
    // get new pass, then save
    res.status(500).json({ message: "Error in changing the password" });
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


// Get Trainer by the Emp who registered him
const getTrainersByEmpID = asyncHandler(async(req, res) => {

    // Get Emp Id - check his role, if ADMIN return ALL else return from their ID


})

// Update

export {
    trainerLogin,
    acceptNDA,
    updateTrainerProfile,
    addTrainingDates,
    getTrainerById,
    getAllTrainer,
    resumeCopy,
    changepassword
}