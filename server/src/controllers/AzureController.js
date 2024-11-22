// controllers/AzureController.js
import axios from "axios";
import dotenv from "dotenv";
import { transformResumeData } from "../utils/ResumeUtils.js";

dotenv.config();

const endpoint = process.env.AZURE_ENDPOINT;
const apiKey = process.env.AZURE_API_KEY;
const modelId = process.env.MODEL_ID;

// Check Azure connection
export const checkAzureConnection = async(req, res) => {
    console.log("0")
    try {
        console.log("1")
        const url = `${endpoint}formrecognizer/documentModels/${modelId}?api-version=2023-07-31`;
        console.log("2")
        console.log(url)
        console.log("3")

        const response = await axios.get(url, {
            headers: { "Ocp-Apim-Subscription-Key": apiKey },
        });
        console.log("5")

        console.log(url)

        res.status(200).json({
            message: "Successfully connected to Azure",
            modelStatus: response.data.status,
            modelId: response.data.modelId,
        });
    } catch (error) {
        console.log("err ", error)
        res.status(500).json({
            error: "Failed to connect to Azure",
            details: error.message,
            responseData: error.response ? error.response.data : null,
        });
    }
};

// Process document
export const processDocument = async(file, res) => {
    try {
        const fileBase64 = file.buffer.toString("base64");

        const url = `${endpoint}formrecognizer/documentModels/${modelId}:analyze?api-version=2023-07-31`;
        const response = await axios.post(url, { base64Source: fileBase64 }, {
            headers: {
                "Ocp-Apim-Subscription-Key": apiKey,
                "Content-Type": "application/json",
            },
        });

        const operationLocation = response.headers["operation-location"];
        console.log("Operation Location:", operationLocation);

        // Poll for results
        let analysisResult;
        do {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const resultResponse = await axios.get(operationLocation, {
                headers: { "Ocp-Apim-Subscription-Key": apiKey },
            });
            analysisResult = resultResponse.data;
        } while (analysisResult.status !== "succeeded" && analysisResult.status !== "failed");

        // Process the results to extract relevant fields
        const processedResult = {
            status: analysisResult.status,
            createdDateTime: analysisResult.createdDateTime,
            lastUpdatedDateTime: analysisResult.lastUpdatedDateTime,
            fields: analysisResult.analyzeResult.documents[0].fields || {},
        };

        const transformedResult = transformResumeData(processedResult);
        res.status(200).json(transformedResult);
    } catch (error) {
        res.status(500).json({
            error: "Failed to process document",
            details: error.message,
            responseData: error.response ? error.response.data : null,
        });
    }
};