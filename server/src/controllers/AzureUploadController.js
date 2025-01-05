// controllers/AzureBlobController.js
import { BlobServiceClient } from "@azure/storage-blob";
import dotenv from "dotenv";

dotenv.config();

const sasToken = process.env.SAS_TOKEN;
const accountName = process.env.ACCOUNT_NAME; // Azure Storage account name
const containerName = process.env.CONTAINER_NAME; // Default container name
const TRAINER_CONTAINER_NAME = process.env.TRAINER_CONTAINER_NAME;
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

// Controller for - Storing Notes PDF in AZure and return the url
export const uploadFileToBlob = async(file, folderName, projectName) => {
    try {
        const containerClient = blobServiceClient.getContainerClient(containerName);

        // Create the container if it doesn't already exist
        await containerClient.createIfNotExists();

        // Generate a unique blob name with the folder path (e.g., folderName/fileName)
        const blobName = `${projectName}/${file.originalname}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        // Upload file buffer to Azure Blob Storage
        await blockBlobClient.uploadData(file.buffer, {
            blobHTTPHeaders: { blobContentType: file.mimetype },
        });
        // Get the blob URL
        const blobUrl = blockBlobClient.url;
        return { success: true, message: "File uploaded successfully", url: blobUrl };
    } catch (error) {
        console.error("Error uploading to Azure Blob Storage:", error.message);
        throw new Error("File upload to Azure Blob Storage failed.");
    }
};



// // Controller for - Storing Notes PDF in AZure and return the url
export const uploadPOToBlob = async(file, fileName, projectName) => {
    try {
        const containerClient = blobServiceClient.getContainerClient(containerName);

        // Create the container if it doesn't already exist
        await containerClient.createIfNotExists();

        // Generate a unique blob name with the folder path (e.g., folderName/fileName)
        const blobName = `${projectName}/Invoice/${file.originalname}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);


        await blockBlobClient.uploadData(file.buffer, {
            blobHTTPHeaders: { blobContentType: file.mimetype },
        });
        // Get the blob URL
        const blobUrl = blockBlobClient.url;
        return { success: true, message: "File uploaded successfully", url: blobUrl };
    } catch (error) {
        console.error("Error uploading to Azure Blob Storage:", error.message);
        throw new Error("File upload to Azure Blob Storage failed.");
    }
};



export const uploadInvoiceToBlob = async(file, fileName, projectName) => {
    try {
        const containerClient = blobServiceClient.getContainerClient(containerName);

        console.log("*********file ", file, fileName.mimetype)
        console.log(fileName, projectName)

        // Create the container if it doesn't already exist
        await containerClient.createIfNotExists();

        // Generate a unique blob name with the folder path (e.g., folderName/fileName)
        const blobName = `${projectName}/Invoice/${fileName}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        // Upload PDF to Azure Blob Storage with Content-Type
        await blockBlobClient.uploadData(file.buffer, {
            blobHTTPHeaders: { blobContentType: file.mimetype },
        });

        // Get the blob URL
        const blobUrl = blockBlobClient.url;
        return { success: true, message: "File uploaded successfully", url: blobUrl };
    } catch (error) {
        console.error("Error uploading to Azure Blob Storage:", error.message);
        throw new Error("File upload to Azure Blob Storage failed.");
    }
};









// // Controller for - Storing Notes PDF in AZure and return the url
export const uploadPanAndAadharToBlob = async(file, fileName, trainer) => {
    try {
        const containerClient = blobServiceClient.getContainerClient(TRAINER_CONTAINER_NAME);

        // Create the container if it doesn't already exist
        await containerClient.createIfNotExists();

        // Generate a unique blob name with the folder path (e.g., folderName/fileName)
        const blobName = `${trainer}/${fileName}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        // Upload file buffer to Azure Blob Storage
        await blockBlobClient.uploadData(file.buffer, {
            blobHTTPHeaders: { blobContentType: 'application/pdf' },
        });

        // Get the blob URL
        const blobUrl = blockBlobClient.url;
        return { success: true, message: "File uploaded successfully", url: blobUrl };
    } catch (error) {
        console.error("Error uploading to Azure Blob Storage:", error.message);
        throw new Error("File upload to Azure Blob Storage failed.");
    }
};