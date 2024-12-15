import asyncHandler from "../utils/asyncHandler.js";
import { Resume, Trainer } from "../models/TrainerModel.js";
import { generateEmpToken, generateToken } from "../utils/generateToken.js";
import bcrypt from 'bcryptjs';
import argon2 from 'argon2';
import Project from "../models/ProjectModel/ProjectModel.js";

// Login - Trainer with trainerId and Trainer_password
const trainerLogin = asyncHandler(async(req, res) => {
    const { email, password } = req.body
    console.log(req.body)
    if (email === "" || password === "") {
        return res
            .status(400)
            .json({ message: "Please provide both email and password." })
    }

    const trainer = await Trainer.find({ "generalDetails.email": email })
        .populate('resumeVersion')
        // .select("-password")
    console.log(trainer[0].password, password)
    console.log(trainer)
    try {
        if (trainer && (await argon2.verify(trainer[0].password, password))) {
            console.log(trainer)
                // await trainer
            let token = generateToken(res, trainer._id);
            console.log("login token ", token);
            res
                .status(200)
                .json({ trainer });
        } else {
            console.log("error")
            res
                .status(500)
                .json({ message: "Error in login", error: await bcrypt.compare(password, trainer[0].password) });
        }
    } catch (error) {
        console.log(error)
        res
            .status(500)
            .json({ message: "Error in login", error: error.message });
    }

})


// Accept the NDA
const acceptNDA = asyncHandler(async(req, res) => {
    // Get the Id of the Trainer
    const trainerId = req.query.trainerId
    console.log(req.query.trainerId)
        // Check if the Trainer Exist
    const trainer = await Trainer.findByIdAndUpdate(trainerId, {
        nda_Accepted: true,
        is_FirstLogin: false
    }, { new: true })

    try {
        await trainer.save();
        res
            .status(200)
            .json({ message: 'NDA accepted successfully', trainer });
    } catch (err) {
        res
            .status(500)
            .json({ message: "Error in accepting the NDA", err: err.message });
    }
})

// Rejected the NDA - Sign out Sign out Update the Profile By Trainer
const updateTrainerProfile = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    console.log("Updating Data ", req.body, id)
    try {
        // Find the trainer by ID and update their profile
        const updatedTrainer = await Trainer.findByIdAndUpdate(id, {
            $set: updateData
        }, {
            new: true,
            runValidators: true
        });

        if (!updatedTrainer) {
            return res
                .status(404)
                .json({ message: "Trainer not found" });
        }

        await updatedTrainer.save()

        res
            .status(200)
            .json({ message: "Trainer profile updated successfully", trainer: updatedTrainer });
    } catch (error) {
        console.error("Error updating trainer profile:", error);
        res
            .status(500)
            .json({ error: "Internal server error" });
    }

})

// add new Training dates
const addTrainingDates = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const trainingDates = req.body;
    console.log(trainingDates);

    // Append training dates
    const trainer = await Trainer.findByIdAndUpdate(id, {
        $push: {
            availableDate: {
                start: new Date(trainingDates.start),
                end: new Date(trainingDates.end),
                title: trainingDates.title
            }
        }
    }, { new: true })

    if (!trainer) {
        return res
            .status(404)
            .json({ message: "Trainer not found" });
    }

    res
        .status(200)
        .json({ message: "Training dates added successfully", trainer: trainer });
})


// Make a copy of the resume - Create a New Resume By the Trainer
const addMainResume = asyncHandler(async(req, res) => {
    const { id } = req.params;
    console.log("Trainer Id", id)
    console.log(req.body)

    // Check if the trainer exits
    const trainer = await Trainer.findById(id);
    if (!trainer) {
        return res
            .status(404)
            .json({ message: "Trainer not found" });
    }

    try {

        // Create A new docs for this resume - save it in the trainers profile
        const resume = new Resume({
            professionalSummary: req.body.professionalSummary,
            technicalSkills: req.body.technicalSkills,
            careerHistory: req.body.careerHistory,
            certifications: req.body.certifications,
            education: req.body.education,
            trainingsDelivered: req.body.trainingsDelivered,
            clientele: req.body.clientele,
            experience: req.body.experience,
            domain: req.body.domain,
            trainer_id: id,
            // trainingName: {     name: req.body.trainingName.name,     project:
            // req.body.trainingName._id },
            // projects: req.body.projects._id,
            isMainResume: true
        })
        await resume.save()

        // Save the resume to the trainer profile
        await trainer
            .resumeVersion
            .push(resume._id);
        await trainer.save();

        res
            .status(200)
            .json({ message: "Resume copy created successfully", resume });

    } catch (err) {
        console.error("Error creating resume copy:", err);
        res
            .status(500)
            .json({ error: "Internal server error" });
    }
})


// Make a copy of the resume - Create a New Resume By the Trainer
const resumeCopy = asyncHandler(async(req, res) => {
    const { id } = req.params;
    console.log("Trainer Id", id)
    console.log(req.body)

    // Check if the trainer exits
    const trainer = await Trainer.findById(id);
    if (!trainer) {
        return res
            .status(404)
            .json({ message: "Trainer not found" });
    }

    try {

        // Create A new docs for this resume - save it in the trainers profile
        const resume = new Resume({
            professionalSummary: req.body.professionalSummary,
            technicalSkills: req.body.technicalSkills,
            careerHistory: req.body.careerHistory,
            certifications: req.body.certifications,
            education: req.body.education,
            trainingsDelivered: req.body.trainingsDelivered,
            clientele: req.body.clientele,
            experience: req.body.experience,
            domain: req.body.domain,
            trainer_id: id,
            // trainingName: {     name: req.body.trainingName.name,     project:
            // req.body.trainingName._id },
            projects: req.body.projects._id,
            isMainResume: false
        })
        await resume.save()

        // Save the resume to the trainer profile
        await trainer
            .resumeVersion
            .push(resume._id);
        await trainer.save();

        // Save the Resume to the Trainer's resume Field in the Project
        await Project.findByIdAndUpdate(req.body.projects._id, {
            $addToSet: {
                "trainers.resume": resume._id
            }
        }, { new: true })

        res
            .status(200)
            .json({ message: "Resume copy created successfully", trainer: trainer });

    } catch (err) {
        console.error("Error creating resume copy:", err);
        res
            .status(500)
            .json({ error: "Internal server error" });
    }
})

// Change password
const changepassword = asyncHandler(async(req, res) => {
    const trainerId = req.params.id;
    const { currentPassword, newpassword } = req.body;

    try {
        const trainer = await Trainer.findById(trainerId).select('generalDetails password');
        console.log(trainer.password)
        if (!trainer) {
            return res.status(404).json({ message: 'Trainer not found' });
        }

        // Check if the old password matches
        console.log("Pass ", trainer)
        const isMatch = await argon2.verify(trainer.password, currentPassword);
        console.log(isMatch)
        if (!isMatch) {
            return res.status(401).json({ message: 'Old password is incorrect' });
        }
        console.log(1)
            // Hash the new password
        const hashedPassword = await argon2.hash(newpassword);
        console.log(2)

        // Update the password in the database
        trainer.password = hashedPassword;
        await trainer.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error changing password:', error.message);
        res.status(500).json({ message: 'Error in changing the password' });
    }
});


// Reset Password
const resetPassword = asyncHandler(async(req, res) => {
    const trainerId = req.params.id;
    // const { currentPassword, newpassword } = req.body;

    try {
        const trainer = await Trainer.findById(trainerId).select(' password');
        console.log(trainer.password)
        if (!trainer) {
            return res.status(404).json({ message: 'Trainer not found' });
        }

        // Hash the new password
        const hashedPassword = await argon2.hash("P@ssw0rd");
        console.log(2)

        // Update the password in the database
        trainer.password = hashedPassword;
        await trainer.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error changing password:', error.message);
        res.status(500).json({ message: 'Error in changing the password' });
    }
})

// Accept PO Reject PO Raise Invoice Get Trainer by ID
const getTrainerById = asyncHandler(async(req, res) => {
    const { id } = req.params;

    try {
        const trainer = await Trainer
            .findById(id)
            .populate({
                path: 'resumeVersion',
                populate: {
                    path: 'projects',
                    select: 'projectName', // Only fetch the 'employeeId' field from each employee
                }
            })
            .select(' -password -nda_Accepted -is_FirstLogin')
            .populate({
                path: 'projects',
                // populate: { path: 'employees', // Path of employee IDs within each Project
                select: 'company.name projectName domain trainingDates', // Only fetch the 'name' field from each employee
                // },
            })
            // .populate({     path: 'projects.projectOwner',     select: 'name email', //
            // Only fetch the 'employeeId' field from each employee });
        if (!trainer) {
            return res
                .status(404)
                .json({ message: "Trainer not found" });
        }
        res
            .status(200)
            .json(trainer);
    } catch (err) {
        return res
            .status(404)
            .json({ message: "Trainer not found" });
    }
})

// get all trainers
const getAllTrainer = asyncHandler(async(req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    try {
        const trainers = await Trainer
            .find()
            .select('-password');
        if (!trainers || trainers.length === 0) {
            return res
                .status(404)
                .json({ message: "No trainers found" });
        }
        res
            .status(200)
            .json(trainers);
    } catch (error) {
        console.error("Error getting all trainers:", error);
        res
            .status(500)
            .json({ error: "Internal server error" });
    }
})

// Get Resume By Id

const getResumeById = asyncHandler(async(req, res) => {
    const { id } = req.params;

    try {
        const resume = await Resume
            .findById(id)
            .populate({ path: 'trainer_id', select: 'generalDetails.name' })
        if (!resume) {
            return res
                .status(404)
                .json({ message: "Resume not found" });
        }
        res
            .status(200)
            .json(resume);
    } catch (err) {
        return res
            .status(404)
            .json({ message: "Resume not found" });
    }
})

// Get Trainer by the Emp who registered him
const getTrainersByEmpID = asyncHandler(async(req, res) => {

    // Get Emp Id - check his role, if ADMIN return ALL else return from their ID

})

// Update

const signOut = asyncHandler(async(req, res) => {
    res
        .clearCookie('jwt')
        .status(200)
        .json('Signout success!');
})

// Lock or UnLock the Resume
const lockResume = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const { isLock } = req.body;
    console.log(isLock)
    console.log(req.body)

    // Check if the Resume Exists
    const resumeExists = await Resume.findById(id);
    if (!resumeExists) {
        return res
            .status(404)
            .json({ message: "Resume not found" });
    }

    // Update the Resume Field
    try {
        await Resume.findByIdAndUpdate(id, {
            $set: {
                isLocked: isLock
            }
        }, { new: true })

        res
            .status(200)
            .json({ message: "Resume Lock status updated successfully", resume: resumeExists });

    } catch (err) {
        console.error("Error updating resume lock status:", err);
        res
            .status(500)
            .json({ error: "Internal server error" });
    }
})



// Add working Dates
const addWorkingDates = asyncHandler(async(req, res) => {
    const { trainerId } = req.params;
    // const { startDate, endDate, position } = req.body;
    console.log(req.body)

    try {
        await Trainer.findByIdAndUpdate(trainerId, {
            $push: {
                workingDates: req.body
            }
        }, { new: true })

        res
            .status(200)
            .json({ message: "Working dates added successfully" });

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
})

export {
    trainerLogin,
    acceptNDA,
    updateTrainerProfile,
    addTrainingDates,
    getTrainerById,
    getAllTrainer,
    resumeCopy, // - Create a New Resume
    changepassword,
    signOut,
    getResumeById,
    lockResume,
    // updateData,
    addMainResume,
    resetPassword,
    addWorkingDates
}