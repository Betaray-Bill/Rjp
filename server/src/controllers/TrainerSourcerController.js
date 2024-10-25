import asyncHandler from "../utils/asyncHandler.js";
import Employee from "../models/EmployeeModel.js";
import { Trainer } from "../models/TrainerModel.js";
import { readFileSync, unlinkSync } from "fs"
import axios from "axios";
import { transformResumeData } from "../utils/azure/extract/extractfunction.js";
import { resumeCopy } from "./TrainerController.js";

const endpoint = process.env.AZURE_ENDPOINT;
const apiKey = process.env.AZURE_API_KEY;
const modelId = process.env.MODEL_ID;

// Register Trainer - Create a new Trainer
// POST - /register
const registerTrainer = asyncHandler(async(req, res) => {
    console.log(req.body);
    const trainerId = req.params.trainerId
    try {
        // Create a new Trainer using the updated schema
        const trainer = new Trainer({
            generalDetails: {
                name: req.body.generalDetails.name,
                email: req.body.generalDetails.email,
                phoneNumber: req.body.generalDetails.phoneNumber,
                whatsappNumber: req.body.generalDetails.whatsappNumber,
                alternateNumber: req.body.generalDetails.alternateNumber,
                dateOfBirth: req.body.generalDetails.dateOfBirth
            },
            bankDetails: {
                accountName: req.body.bankDetails.accountName,
                accountNumber: req.body.bankDetails.accountNumber,
                bankName: req.body.bankDetails.bankName,
                bankBranch: req.body.bankDetails.bankBranch,
                bankIFSCCode: req.body.bankDetails.bankIFSCCode,
                pancardNumber: req.body.bankDetails.pancardNumber,
                aadharCardNumber: req.body.bankDetails.aadharCardNumber,
                gstNumber: req.body.bankDetails.gstNumber,
                vendorName: req.body.bankDetails.vendorName
            },
            trainingDetails: {
                trainerType: req.body.trainingDetails.trainerType,
                modeOfTraining: req.body.trainingDetails.modeOfTraining
            },
            trainingDomain: req.body.trainingDomain.map(domain => ({
                domain: domain.domain,
                price: Number(domain.price),
                paymentSession: domain.paymentSession
            })),
            mainResume: {
                professionalSummary: req.body.mainResume.professionalSummary,
                technicalSkills: req.body.mainResume.technicalSkills,
                careerHistory: req.body.mainResume.careerHistory,
                certifications: req.body.mainResume.certifications,
                education: req.body.mainResume.education,
                trainingsDelivered: req.body.mainResume.trainingsDelivered,
                clientele: req.body.mainResume.clientele,
                experience: req.body.mainResume.experience
            },
            isFirstLogin: true,
            ndaAccepted: req.body.trainingDetails.trainerType === "Internal" ? true : false,
            password: req.body.generalDetails.dateOfBirth,
            trainerId: await generateTrainerId(),
        });

        // Save the trainer to the database
        await trainer.save();

        // get the Trainer Id

        res.status(201).json({
            message: 'Trainer created successfully',
            Trainer: trainer,
            success: true
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Trainer Not Added to the Server', err: err });
    }
});



// Upload the Resume to azure and extract the text
const uploadResumeToAzureAndExtractText = asyncHandler(async(req, res) => {
    // console.log("Hii", req.file)
    try {
        if (!req.file) {
            return res.status(400).send({ error: "No file uploaded." });
        }

        console.log("object")

        const filePath = req.file.path;
        // console.log("filePath", filePath)
        const fileBuffer = readFileSync(filePath);
        // console.log("fileBuffer", fileBuffer)

        const fileBase64 = fileBuffer.toString('base64');
        // console.log("Filebase 64", fileBase64)
        const url = `${process.env.AZURE_ENDPOINT}formrecognizer/documentModels/${process.env.MODEL_ID}:analyze?api-version=2023-07-31`;
        console.log("url ", url)

        const response = await axios.post(url, { base64Source: fileBase64 }, {
            headers: {
                "Ocp-Apim-Subscription-Key": process.env.AZURE_API_KEY,
                "Content-Type": "application/json"
            },
        });

        const operationLocation = response.headers['operation-location'];
        console.log("Operation Location:", operationLocation);

        // Poll for results
        let analysisResult;
        do {
            // await new Promise(resolve => setTimeout(resolve, 1000));
            const resultResponse = await axios.get(operationLocation, {
                headers: { "Ocp-Apim-Subscription-Key": apiKey },
            });
            analysisResult = resultResponse.data;
        } while (analysisResult.status !== "succeeded" && analysisResult.status !== "failed");

        // Clean up the uploaded file
        unlinkSync(filePath);

        // Process the results to extract relevant fields
        const processedResult = {
            status: analysisResult.status,
            createdDateTime: analysisResult.createdDateTime,
            lastUpdatedDateTime: analysisResult.lastUpdatedDateTime,
            fields: {}
        };

        // Extract fields from the documents array
        if (analysisResult.analyzeResult &&
            analysisResult.analyzeResult.documents &&
            analysisResult.analyzeResult.documents.length > 0) {
            const fields = analysisResult.analyzeResult.documents[0].fields;
            for (const [key, value] of Object.entries(fields)) {
                processedResult.fields[key] = {
                    content: value.content
                };
            }
        }

        // Transform the processed result
        const transformedResult = transformResumeData(processedResult);

        res.status(200).json(transformedResult);
    } catch (error) {
        console.error("Error processing document:", error.message);
        res.status(500).json({
            error: "Failed to process document",
            details: error.message,
            responseData: error.response ? error.response.data : null
        });
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

            // console.log("Result", trainer.resumeVersions)
            res.status(200).json({
                message: "Resume saved succesfully",
                trainer: updatedTrainer
            });

        } else {
            // if copy then check if the same resume exists, then update the docs in the collection

            console.log(req.body.trainingName)
            console.log("Length ", trainer.resumeVersions.length)
                // const existingResume = await trainer.resumeVersions.forEach((e))
            let resumeNew = []
            for (let i = 0; i < trainer.resumeVersions.length; i++) {
                console.log(trainer.resumeVersions[i].trainingName)
                if (trainer.resumeVersions[i].trainingName === req.body.trainingName) {
                    console.log("-----------------------------")
                    console.log(trainer.resumeVersions[i])
                    let newRes = {
                        professionalSummary: req.body.professionalSummary,
                        technicalSkills: req.body.technicalSkills,
                        careerHistory: req.body.careerHistory,
                        certifications: req.body.certifications,
                        education: req.body.education,
                        trainingsDelivered: req.body.trainingsDelivered,
                        clientele: req.body.clientele,
                        experience: req.body.experience,
                        trainingName: req.body.trainingName
                    }
                    resumeNew.push(newRes)
                } else {
                    resumeNew.push(trainer.resumeVersions[i])
                }
            }
            const updatedResumeTrainer = await Trainer.findByIdAndUpdate(
                id, { $set: { resumeVersions: resumeNew } }, { new: true, runValidators: true }
            )

            await updatedResumeTrainer.save();

            console.log("New ", resumeNew)

            console.log("Result", updatedResumeTrainer.resumeVersions)
            res.status(200).json({
                message: "Resume saved succesfully",
                trainer: updatedResumeTrainer
            });
        }

    } catch (err) {
        console.error("Error creating resume copy:", err);
        res.status(500).json({ error: "Internal server error" });
    }
})



export {
    registerTrainer,
    updateResume,
    uploadResumeToAzureAndExtractText
}