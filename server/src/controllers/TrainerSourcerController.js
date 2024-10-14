import asyncHandler from "../utils/asyncHandler.js";
import Employee from "../models/EmployeeModel.js";
import { Trainer } from "../models/TrainerModel.js";



// Register Trainer - Create a new Trainer
// POST - /register
const registerTrainer = asyncHandler(async(req, res) => {
    console.log(req.body)

    try {

        // Save the Trainer Details
        // Create a new Trainer
        const trainer = new Trainer({
            name: req.body.name,
            type_of_trainer: req.body.type_of_trainer,
            trainer_sourcer: req.body.trainer_sourcer,
            dob: req.body.dob,
            password: req.body.password,
            rating: req.body.rating,
            price: {
                amount: req.body.price,
                type: req.body.price_type
            },
            training_mode: req.body.mode,
            trainerId: await generateTrainerId(),
            is_FirstLogin: req.body.is_FirstLogin || true,
            nda_Accepted: req.body.type_of_trainer === "Internal" ? true : false,
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
            mainResume: {
                professionalSummary: req.body.mainResume.professionalSummary,
                technicalSkills: req.body.mainResume.technicalSkills,
                careerHistory: req.body.mainResume.careerHistory,
                certifications: req.body.mainResume.certifications,
                education: req.body.mainResume.education,
                trainingsDelivered: req.body.mainResume.trainingsDelivered,
                clientele: req.body.mainResume.clientele,
                experience: req.body.mainResume.experience,
                file_url: "" //get from the Azure storage
            }

        });
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


// update an existing Resume
const updateResume = asyncHandler(async(req, res) => {
    const { id } = req.params;
    console.log("Trainer Id", id)
    console.log(req.body)

    // Check if the trainer exits
    const trainer = await Trainer.findById(id);
    if (!trainer) {
        return res.status(404).json({ message: "Trainer not found" });
    }

    try {
        // Check if it the main or copy resume
        let isMainResume = req.body.isMainResume
            // if main then updateBytrainerID
        if (isMainResume) {
            let updatedTrainer = await Trainer.findByIdAndUpdate(
                id, { $set: { mainResume: {...req.body } } }, { new: true, runValidators: true }
            )

            if (!updatedTrainer) {
                return res.status(404).json({ message: 'Trainer not found' });
            }
            await updatedTrainer.save()
        } else {
            // if copy then check if the same resume exists, then update the docs in the collection

            console.log(req.body.trainingName)
            console.log("Length ", trainer.resumeVersions.length)
                // const existingResume = await trainer.resumeVersions.forEach((e))

            for (let i = 0; i < trainer.resumeVersions.length; i++) {
                console.log(trainer.resumeVersions[i].trainingName)
                if (trainer.resumeVersions[i].trainingName === req.body.trainingName) {
                    console.log("-----------------------------")
                    console.log(trainer.resumeVersions[i])
                        // Update the specific index using splice
                        // trainer.resumeVersions.splice(i, 1, {
                        //     ...trainer.resumeVersions[i], // Keep the existing data
                        //     ...req.body.resumeVersion,    // Update with the new data from the request
                        // });
                    await trainer.resumeVersions.splice(i, 1, {
                        professionalSummary: req.body.professionalSummary,
                        technicalSkills: req.body.technicalSkills,
                        careerHistory: req.body.careerHistory,
                        certifications: req.body.certifications,
                        education: req.body.education,
                        trainingsDelivered: req.body.trainingsDelivered,
                        clientele: req.body.clientele,
                        experience: req.body.experience,
                        trainingName: req.body.trainingName
                    })
                    break;
                }
            }
            await trainer.save();
        }


        res.status(200).json({
            message: "Resume saved succesfully",
            trainer: trainer
        });

    } catch (err) {
        console.error("Error creating resume copy:", err);
        res.status(500).json({ error: "Internal server error" });
    }
})



export {
    registerTrainer,
    updateResume
}