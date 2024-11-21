// controllers/AzureBlobController.js
import { BlobServiceClient } from "@azure/storage-blob";
import dotenv from "dotenv";

dotenv.config();

const sasToken = process.env.SAS_TOKEN;
const accountName = process.env.ACCOUNT_NAME; // Azure Storage account name
const containerName = process.env.CONTAINER_NAME; // Default container name

// Initialize Blob Service Client
const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net?${sasToken}`
);

// Function to check Azure Blob Storage connection
export const checkBlobConnection = async(req, res) => {
    try {
        console.log("blob connection ", blobServiceClient.url)
        const containerClient = blobServiceClient.getContainerClient(containerName);

        // Check connection by fetching container properties
        await containerClient.getProperties();

        res.status(200).json({
            message: "Successfully connected to Azure Blob Storage",
            container: containerName,
        });
    } catch (error) {
        console.error("Error connecting to Azure Blob Storage:", error.message);
        res.status(500).json({
            error: "Failed to connect to Azure Blob Storage",
            details: error.message,
        });
    }
};

// Function to upload a file to Azure Blob Storage
export const uploadFileToBlob = async(file, folderName, projectName) => {
    try {
        const containerClient = blobServiceClient.getContainerClient(containerName);

        // Create the container if it doesn't already exist
        await containerClient.createIfNotExists();

        // Generate a unique blob name with the folder path (e.g., folderName/fileName)
        const blobName = `Training/${projectName}/${file.originalname}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        // Upload file buffer to Azure Blob Storage
        await blockBlobClient.uploadData(file.buffer);

        // Get the blob URL
        const blobUrl = blockBlobClient.url;
        return { success: true, message: "File uploaded successfully", url: blobUrl };
    } catch (error) {
        console.error("Error uploading to Azure Blob Storage:", error.message);
        throw new Error("File upload to Azure Blob Storage failed.");
    }
};