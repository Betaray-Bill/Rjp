import asyncHandler from "../utils/asyncHandler.js";
import Employee from "../models/EmployeeModel.js";
import { Resume, Trainer } from "../models/TrainerModel.js";
import { readFileSync, unlinkSync } from "fs"
import axios from "axios";
import { transformResumeData } from "../utils/azure/extract/extractfunction.js";
import { resumeCopy } from "./TrainerController.js";
import TrainerSourcer from "../models/RoleModels/TrainerSourcerModel.js";
import Admin from "../models/RoleModels/AdminModel.js";

const endpoint = process.env.AZURE_ENDPOINT;
const apiKey = process.env.AZURE_API_KEY;
const modelId = process.env.MODEL_ID;

// Register Trainer - Create a new Trainer POST - /register
const registerTrainer = asyncHandler(async(req, res) => {
    // console.log(req.body);
    const trainerId = req.params.trainerId
    try {
        // check if he already registered const existingTrainer = await
        // Trainer.findOne({ 'generalDetails.email': req.body.generalDetails.email }) if
        // (existingTrainer) {     return res.status(400).json({ message: "Trainer
        // already registered" }); } Register the Main Resume and get its Id from its
        // collections
        const mainResume = new Resume({
            professionalSummary: req.body.mainResume.professionalSummary,
            technicalSkills: req.body.mainResume.technicalSkills,
            careerHistory: req.body.mainResume.careerHistory,
            certifications: req.body.mainResume.certifications,
            education: req.body.mainResume.education,
            trainingsDelivered: req.body.mainResume.trainingsDelivered,
            clientele: req.body.mainResume.clientele,
            experience: req.body.mainResume.experience,
            trainingName: req.body.mainResume.trainingName ?
                req.body.mainResume.trainingName : "Main Resume",
            isMainResume: true
        })
        await mainResume.save()

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
            trainingDomain: req
                .body
                .trainingDomain
                .map(domain => ({
                    domain: domain.domain,
                    price: Number(domain.price),
                    paymentSession: domain.paymentSession
                })),
            resumeVersion: [mainResume._id],
            trainer_sourcer: trainerId,
            isFirstLogin: true,
            ndaAccepted: req.body.trainingDetails.trainerType === "Internal" ?
                true : false,
            password: req.body.generalDetails.dateOfBirth,
            trainerId: await generateTrainerId()
        });

        // Save the trainer to the database
        await trainer.save();

        // get the Trainer Id and save it in the resume version docs
        const resume = await Resume.findByIdAndUpdate(mainResume._id, {
            trainer_id: trainer._id
        }, { new: true });
        await resume.save()

        // save the Trainers Id in the trainer Sourcer's Docs
        const emp = await Employee.findById(trainerId)
        if (emp) {
            console.log("Inside EMp", emp.role)
                // get the TrainerSourcer Id and then push the trainers Id in the docs
            for (let i = 0; i < emp.role.length; i++) {
                console.log(emp.role[i].name)
                if (emp.role[i].name === 'Trainer Sourcer') {
                    console.log("Tainer Src")
                    await TrainerSourcer.findByIdAndUpdate(emp.role[i].roleId, {
                        $push: {
                            registeredTrainers: trainer._id
                        }
                    }, { new: true });
                    // await trainer.save()
                    break;
                }

                if (emp.role[i].name == 'ADMIN') {
                    console.log('Admin is present')
                    await Admin.findByIdAndUpdate(emp.role[i].roleId, {
                        $push: {
                            registeredTrainers: trainer._id
                        }
                    }, { new: true });
                    // await trainer.save()
                    break;
                }
            }
        }

        await emp.save()

        // Return the Result
        res
            .status(201)
            .json({ message: 'Trainer created successfully', Trainer: trainer, success: true });
    } catch (err) {
        console.error(err);
        res
            .status(500)
            .json({ message: 'Trainer Not Added to the Server', err: err });
    }
});

// Upload the Resume to azure and extract the text
const uploadResumeToAzureAndExtractText = asyncHandler(async(req, res) => {
    // console.log("Hii", req.file)
    try {
        if (!req.file) {
            return res
                .status(400)
                .send({ error: "No file uploaded." });
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

        const response = await axios.post(url, {
            base64Source: fileBase64
        }, {
            headers: {
                "Ocp-Apim-Subscription-Key": process.env.AZURE_API_KEY,
                "Content-Type": "application/json"
            }
        });

        const operationLocation = response.headers['operation-location'];
        console.log("Operation Location:", operationLocation);

        // Poll for results
        let analysisResult;
        do {
            // await new Promise(resolve => setTimeout(resolve, 1000));
            const resultResponse = await axios.get(operationLocation, {
                headers: {
                    "Ocp-Apim-Subscription-Key": apiKey
                }
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
        if (analysisResult.analyzeResult && analysisResult.analyzeResult.documents && analysisResult.analyzeResult.documents.length > 0) {
            const fields = analysisResult.analyzeResult.documents[0].fields;
            for (const [key,
                    value
                ] of Object.entries(fields)) {
                processedResult.fields[key] = {
                    content: value.content
                };
            }
        }

        // Transform the processed result
        const transformedResult = transformResumeData(processedResult);

        res
            .status(200)
            .json(transformedResult);
    } catch (error) {
        console.error("Error processing document:", error.message);
        res
            .status(500)
            .json({
                error: "Failed to process document",
                details: error.message,
                responseData: error.response ?
                    error.response.data : null
            });
    }
})

//Send PO to the Trainer for the respective deal Generate Unique Id
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
    const { trainer_id } = req.params;
    // Check if the trainer exits
    const trainer = await Trainer.findById(trainer_id);
    if (!trainer) {
        return res
            .status(404)
            .json({ message: "Trainer not found" });
    }
    // Get the Resume Id
    const { resume_id } = req.params;
    try {
        // Update the Resume Field
        const updateResume = await Resume.findByIdAndUpdate(resume_id, {
            $set: {
                ...req.body
            }
        }, {
            new: true,
            runValidators: true
        })
        await updateResume.save()

        res
            .status(200)
            .json({ message: "Resume saved successfully", trainer: updateResume });

    } catch (err) {
        console.error("Error creating resume copy:", err);
        res
            .status(500)
            .json({ error: "Internal server error" });
    }
})

// Get Trainer as per the Emp Id
const getTrainerByEmpId = asyncHandler(async(req, res) => {
    const { emp_id } = req.params;
    // Check if the Employee exists
    const Emp = await Employee.findById(emp_id);

    if (!Emp) {
        return res
            .status(404)
            .json({ message: "Employee not found" });
    }

    // if the Employee exists, then get the Trainers registered by him
    if (Emp) {
        console.log("Inside EMp", Emp.role)
            // get the TrainerSourcer Id and then push the trainers Id in the docs
        for (let i = 0; i < Emp.role.length; i++) {
            console.log(Emp.role[i].name)
            if (Emp.role[i].name === 'Trainer Sourcer') {
                const trainers = await TrainerSourcer.findById(Emp.role[i].roleId).populate('registeredTrainers').select('registeredTrainers')
                    // Return the Result
                res
                    .status(201)
                    .json({ message: 'Trainer Fetched successfully', trainers: trainers.registeredTrainers, success: true });

            }

            if (Emp.role[i].name == 'ADMIN') {
                const trainers = await Trainer.find()
                    // Return the Result
                res
                    .status(201)
                    .json({ message: 'Trainer Fetched successfully', trainers: trainers, success: true });

            }
        }
    }

})

export { registerTrainer, updateResume, uploadResumeToAzureAndExtractText, getTrainerByEmpId }