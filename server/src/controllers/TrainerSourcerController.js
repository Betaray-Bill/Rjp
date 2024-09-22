import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import Employee from "../models/EmployeeModel.js";
import Trainer from "../models/TrainerModel.js";



// Register Trainer - Create a new Trainer
// POST - /register
const registerTrainer = asyncHandler(async(req, res) => {
    const trainerSourcerId = req.body.trainerSourcer_Id
    console.log(req.body)
        // check if the trainer is already registered
    const trainerSourcer = await Employee.findOne(trainerSourcerId)

    if (!trainerSourcer) {
        return res.status(400).json({ message: 'Trainer does not exist' });
    }

    // Create a new Trainer
    const trainer = await Trainer.create({
        name: req.body.name,
        type_of_trainer: req.body.type_of_trainer,
        trainer_sourcer: req.body.trainer_sourcer,
        dob: req.body.dob,
        password: "req.body.dob",
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
    });

    try {
        await trainer.save();
        // Save the trainer's id in the Trainer Sourcer's Docs
        console.log("Trainer Data ->>> ", trainer)
        res.status(201).json({
            message: 'Trainer created successfully',
            Trainer: trainer,
            success: true
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Trainer Not Added to the Server' });
    }

})




//Send PO to the Trainer for the respective deal








export {
    registerTrainer
}