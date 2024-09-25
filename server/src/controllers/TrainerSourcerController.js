import asyncHandler from "../utils/asyncHandler.js";
import Employee from "../models/EmployeeModel.js";
import Trainer from "../models/TrainerModel.js";



// Register Trainer - Create a new Trainer
// POST - /register
const registerTrainer = asyncHandler(async(req, res) => {
    console.log(req.body)

    // Create a new Trainer
    const trainer = new Trainer({
        name: req.body.name,
        type_of_trainer: req.body.type_of_trainer,
        trainer_sourcer: req.body.trainer_sourcer,
        dob: req.body.dob,
        password: req.body.password,
        trainerId: await generateTrainerId(),
        is_FirstLogin: req.body.is_FirstLogin || true,
        nda_Accepted: req.body.nda_Accepted || false,
        bank_Details: {
            account_Name: req.body.bank_Details.account_Name,
            account_Number: req.body.bank_Details.account_Number,
            bank_Branch: req.body.bank_Details.bank_Branch,
            bank_IFSC_code: req.body.bank_Details.bank_IFSC_code,
            pancard_Number: req.body.bank_Details.pancard_Number,
            aadharcard_number: req.body.bank_Details.aadharcard_number
        },
        contact_Details: {
            mobile_number: req.body.contact_Details.mobile_number,
            email_id: req.body.contact_Details.email_id,
            alternate_contact_number: req.body.contact_Details.alternate_contact_number,
            alternate_email_id: req.body.contact_Details.alternate_email_id
        },
        availableDate: req.body.availableDate,
        resume_details: {
            professionalSummary: req.body.resume_details.professionalSummary,
            technicalSkills: req.body.resume_details.technicalSkills,
            careerHistory: req.body.resume_details.careerHistory,
            certifications: req.body.resume_details.certifications,
            education: req.body.resume_details.education,
            trainingsDelivered: req.body.resume_details.trainingsDelivered,
            clientele: req.body.resume_details.clientele,
            experience: req.body.resume_details.experience
        }
    });

    try {
        await trainer.save();
        res.status(201).json({
            message: 'Trainer created successfully',
            Trainer: trainer,
            success: true
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Trainer Not Added to the Server', err: err });
    }

})

//Send PO to the Trainer for the respective deal





// Generate Unique Id
const generateTrainerId = async() => {
    let trainerId;
    let existingTrainer;

    do {
        trainerId = Math.floor(1000 + Math.random() * 9000).toString(); // Generate 4-digit random ID
        existingTrainer = await Trainer.findOne({ trainerId: trainerId });
    } while (existingTrainer); // Loop until a unique ID is found

    return trainerId;
};



export {
    registerTrainer
}