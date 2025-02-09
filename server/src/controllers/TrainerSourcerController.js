import asyncHandler from "../utils/asyncHandler.js";
import Employee from "../models/EmployeeModel.js";
import { Resume, Trainer } from "../models/TrainerModel.js";
import { readFileSync, unlinkSync } from "fs"
import axios from "axios";
import { transformResumeData } from "../utils/azure/extract/extractfunction.js";
import { resumeCopy } from "./TrainerController.js";
import TrainerSourcer from "../models/RoleModels/TrainerSourcerModel.js";
import Admin from "../models/RoleModels/AdminModel.js";
import bcrypt from "bcryptjs";
import argon2 from 'argon2';

const endpoint = process.env.AZURE_ENDPOINT;
const apiKey = process.env.AZURE_API_KEY;
const modelId = process.env.MODEL_ID;

// Register Trainer - Create a new Trainer POST - /register
const registerTrainer = asyncHandler(async(req, res) => {
    console.log(req.body);
    const trainerId = req.params.trainerId
    try {
        // check if he already registered const existingTrainer = await
        // Trainer.findOne({ 'generalDetails.email': req.body.generalDetails.email }) if
        // (existingTrainer) {     return res.status(400).json({ message: "Trainer
        // already registered" }); } Register the Main Resume and get its Id from its
        // collections
        let resumeId, mainResume
        if (
            req.body.mainResume &&
            Object.keys(req.body.mainResume).some(
                (key) => 
                    req.body.mainResume[key] !== null && 
                    req.body.mainResume[key] !== undefined &&
                    req.body.mainResume[key] !== "" &&
                    (!Array.isArray(req.body.mainResume[key]) || req.body.mainResume[key].length > 0)
            )
        ) {
            mainResume = new Resume({
                professionalSummary: req.body.mainResume.professionalSummary,
                technicalSkills: req.body.mainResume.technicalSkills,
                careerHistory: req.body.mainResume.careerHistory,
                certifications: req.body.mainResume.certifications,
                education: req.body.mainResume.education,
                trainingsDelivered: req.body.mainResume.trainingsDelivered,
                clientele: req.body.mainResume.clientele,
                experience: req.body.mainResume.experience,
                domain: req.body.mainResume.trainingName ?
                    req.body.mainResume.trainingName : "Main Resume",
                isMainResume: true
            })
            await mainResume.save()

            resumeId = mainResume._id

        }
        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.generalDetails.dateOfBirth, salt);

        // Create a new Trainer using the updated schema
        const trainer = new Trainer({
            generalDetails: {
                name: req.body.generalDetails.name,
                email: req.body.generalDetails.email,
                phoneNumber: req.body.generalDetails.phoneNumber,
                whatsappNumber: req.body.generalDetails.whatsappNumber,
                alternateNumber: req.body.generalDetails.alternateNumber,
                dateOfBirth: req.body.generalDetails.dateOfBirth,
                sourcedFrom: req.body.generalDetails.sourcedFrom,
                address: {
                    flat_doorNo_street: req.body.generalDetails.address.flat_doorNo_street,
                    area: req.body.generalDetails.address.area,
                    townOrCity: req.body.generalDetails.address.townOrCity,
                    state: req.body.generalDetails.address.state,
                    pincode: req.body.generalDetails.address.pincode
                }
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
                vendorName: req.body.bankDetails.vendorName,
                panCard: req.body.bankDetails.panCard,
                aadharCard: req.body.bankDetails.aadharCard,
                remarks:req.body.bankDetails.remarks
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
                    price: Number(domain.price) ?
                        Number(domain.price) : Number(),
                    paymentSession: domain.paymentSession !== "" ?
                        domain.paymentSession : "",
                    type: domain.type
                })),
            resumeVersion: resumeId ? [resumeId] : [],
            trainer_sourcer: trainerId,
            isFirstLogin: true,
            ndaAccepted: req.body.trainingDetails.trainerType === "Internal" ?
                true : false,
            // password: req.body.generalDetails.dateOfBirth,
            trainerId: await generateTrainerId(req.body.trainingDetails.trainerType),
            password: await argon2.hash("P@ssw0rd")
        });

        // Save the trainer to the database
        await trainer.save();

        if (resumeId) {

            // get the Trainer Id and save it in the resume version docs
            const resume = await Resume.findByIdAndUpdate(mainResume._id, {
                trainer_id: trainer._id
            }, { new: true });
            await resume.save()
        }

        // save the Trainers Id in the trainerSourcer's Docs
        const emp = await Employee.findById(trainerId)
        if (emp) {
            console.log("Inside EMp", emp.role)
                // get the TrainerSourcer Id and then push the trainers Id in the docs
            for (let i = 0; i < emp.role.length; i++) {
                console.log(emp.role[i].name)
                if (emp.role[i].name === 'TrainerSourcer') {
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
const generateTrainerId = async(type) => {
    // let trainerId; let existingTrainer; do {     trainerId = Math.floor(1000 +
    // Math.random() * 9000).toString(); // Generate 4-digit random ID
    // existingTrainer = await Trainer.findOne({ trainerId: trainerId }); } while
    // (existingTrainer); // Loop until a unique ID is found
    const prefix = "RJP";
    let a;
    if (type === "Internal") {
        a = "I"
    } else {
        a = "E"
    }
    let newId;
    const trainers = await Trainer
        .find({})
        .sort({ createdAt: -1 }) // Sort by `createdAt` in descending order
        .limit(1)
        .select('trainerId');
    console.log(trainers)
    if (trainers === undefined || trainers === null || trainers.length == 0) {
        newId = "0001";
    } else {
        const lastId = trainers[0].trainerId;
        const numericPart = lastId.includes("I") ? parseInt(lastId.split('I')[1], 10) : parseInt(lastId.split('E')[1], 10); // Extract numeric part after 'RJP'
        newId = (numericPart + 1)
            .toString()
            .padStart(4, "0"); // Increment and pad to 4 digits
    }

    const trainerId = prefix + a + newId;
    // array.push(trainerId);

    return trainerId;

    // return trainerId;
};

// update an existing Resume
const updateResume = asyncHandler(async(req, res) => {
    const { trainer_id } = req.params;
    // Check if the trainer exits
    console.log(trainer_id)
    const trainer = await Trainer.findById(trainer_id);
    if (!trainer) {
        return res
            .status(404)
            .json({ message: "Trainer not found" });
    }
    // Get the Resume Id
    const { resume_id } = req.params;
    console.log(resume_id)
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
    console.log(req.query)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    console.log(page, limit, startIndex, endIndex)

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
            if (Emp.role[i].name === 'TrainerSourcer') {
                const trainers = await TrainerSourcer
                    .findById(Emp.role[i].roleId)
                    .populate('registeredTrainers')
                    .select('registeredTrainers')
                    // Return the Result
                res
                    .status(201)
                    .json({
                        message: 'Trainer Fetched successfully',
                        trainers: trainers
                            .registeredTrainers
                            .slice(startIndex, endIndex),
                        success: true,
                        trainersTotals: trainers.registeredTrainers.length
                    });

            }

            if (Emp.role[i].name == 'ADMIN') {
                const trainers = await Trainer
                    .find()
                    .select("generalDetails trainerId trainingDetails Rating")

                // Return the Result
                res
                    .status(201)
                    .json({
                        message: 'Trainer Fetched successfully',
                        trainers: trainers.slice(startIndex, endIndex),
                        success: true,
                        trainersTotals: trainers.length
                    });

            }
        }
    }

})


// Remarks
const addRemark = async(req, res) => {
    try {
        const trainerId = req.params.trainerId;
        const { id, name, description, rating } = req.body;

        console.log(req.body)
            // Find the trainer
        const trainer = await Trainer.findById(trainerId);
        if (!trainer) {
            return res.status(404).json({ message: "Trainer not found" });
        }

        // Check if the remark for this user already exists
        const existingRemarkIndex = trainer.Rating.Remarks.findIndex(
            (remark) => remark.id === id
        );


        console.log("Index,", existingRemarkIndex)

        if (trainer.Rating.Remarks.length > 0) {
            console.log("no")
                // If remark exists, update it
            for (let i = 0; i < trainer.Rating.Remarks.length; i++) {
                if (trainer.Rating.Remarks[i].id == id) {
                    // trainer.Rating.star = rating;
                    trainer.Rating.Remarks[i].description = description;
                    trainer.Rating.Remarks[i].date = new Date().toISOString();
                    await trainer.save();
                    return res.status(200).json({
                        message: "Remark updated successfully",
                        remarks: trainer.Rating.Remarks,
                    });
                }
            }

            console.log("1")

            // If remark doesn't exist, add a new one
            trainer.Rating.Remarks.push({
                id,
                name,
                description,
                date: new Date().toISOString(),
            });
        } else {
            // If remark doesn't exist, add a new one
            console.log("push")
            trainer.Rating.Remarks.push({
                id,
                name,
                description,
                date: new Date().toISOString(),
            });
        }

        // Update the star rating
        trainer.Rating.star = rating;

        // Save changes to the database
        await trainer.save();

        res.status(200).json({
            message: "Remark added or updated successfully",
            remarks: trainer.Rating.Remarks,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


// Remarks
const addRating = async(req, res) => {
    try {
        const trainerId = req.params.trainerId;
        const { rating } = req.body;
        console.log(rating)

        console.log(req.body)
            // Find the trainer
        const trainer = await Trainer.findById(trainerId);
        if (!trainer) {
            return res.status(404).json({ message: "Trainer not found" });
        }

        // Update the star rating
        trainer.Rating.star = rating;

        // Save changes to the database
        await trainer.save();

        res.status(200).json({
            message: "Remark added or updated successfully",
            remarks: trainer.Rating.Remarks,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

const getResumeById = asyncHandler(async(req, res) => {
    const { id } = req.params;
    console.log("Get resume by UD")
    try {
        const resume = await Resume
            .findById(id)
            .populate({ path: 'trainer_id', select: 'generalDetails.name' })

        console.log(resume)
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

export { registerTrainer,getResumeById, updateResume, addRemark, addRating, uploadResumeToAzureAndExtractText, getTrainerByEmpId }