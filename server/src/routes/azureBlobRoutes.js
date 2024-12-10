// routes/azureBlobRoutes.js
import express from "express";
import multer from "multer";
import { uploadFileToBlob, checkBlobConnection, uploadPOToBlob, uploadPanAndAadharToBlob, uploadInvoiceToBlob } from "../controllers/AzureUploadController.js";

const router = express.Router();
const upload = multer(); // Use multer with buffer storage

router.get("/check-blob-connection", checkBlobConnection);


// Endpoint to handle file upload with folder name
router.post("/upload-to-blob", upload.single("file"), async(req, res) => {
    const file = req.file; // Access the uploaded file
    const { fileName, sentBy, projectName, timestamps } = req.body; // Access other fields

    console.log("File received:", file);
    console.log("File name:", fileName);
    console.log("Sent by:", sentBy);
    console.log("Timestamp:", timestamps);

    if (!req.file) {
        return res
            .status(400)
            .json({ error: "No file uploaded." });
    }

    try {
        const result = await uploadFileToBlob(req.file, fileName, projectName);
        res
            .status(200)
            .json(result);
    } catch (error) {
        res
            .status(500)
            .json({ error: error.message });
    }
});


// uploadPOToBlob

// Endpoint to handle file upload with folder name
router.post("/upload-to-blob/training/po", upload.single("file"), async(req, res) => {
    const file = req.file; // Access the uploaded file
    const { fileName, projectName } = req.body; // Access other fields

    console.log("File received:", file);
    console.log("File name:", fileName);
    // console.log("Sent by:", sentBy);
    // console.log("Timestamp:", timestamps);

    if (!req.file) {
        return res
            .status(400)
            .json({ error: "No file uploaded." });
    }

    try {
        const result = await uploadPOToBlob(req.file, fileName, projectName);
        res
            .status(200)
            .json(result);
    } catch (error) {
        res
            .status(500)
            .json({ error: error.message });
    }
});

// Invoice from Trainer to RJP , upload File and return the URL
router.post("/upload-to-blob/training/invoice", upload.single("file"), async(req, res) => {
    const file = req.file; // Access the uploaded file
    const { fileName, projectName } = req.body; // Access other fields

    console.log("File received:", file);
    console.log("File name:", fileName);
    // console.log("Sent by:", sentBy);
    // console.log("Timestamp:", timestamps);

    if (!req.file) {
        return res
            .status(400)
            .json({ error: "No file uploaded." });
    }

    try {
        const result = await uploadInvoiceToBlob(req.file, fileName, projectName);
        res
            .status(200)
            .json(result);
    } catch (error) {
        res
            .status(500)
            .json({ error: error.message });
    }
});



// Endpoint to handle Aadhar and Pan Card file upload with Trainer name
router.post("/upload-aadhar-pan/trainer/:trainer", upload.fields([
    { name: "pancard", maxCount: 1 },
    { name: "aadharCard", maxCount: 1 },
]), async(req, res) => {
    console.log(" uploaded ", req.params)
        // const panCard = req.file.pancard; // Access the uploaded file
        // const aadharCard = req.file.aadharCard; // Access the uploaded file4
        // const { fileName, projectName } = req.body; // Access other fields
    const trainer = req.params.trainer
    console.log(" uploaded ", trainer)
    const files = req.files;

    console.log(files)


    const pancard = files.pancard[0]
    const aadharCard = files.aadharCard[0]

    console.log("pancard file:", pancard); // Details of uploaded pancard
    console.log("AadharCard file:", aadharCard); // Details of uploaded aadhar card

    if (!req.files) {
        return res
            .status(400)
            .json({ error: "No file uploaded." });
    }

    try {
        const resultPan = await uploadPanAndAadharToBlob(pancard, "pancard", trainer);
        const resultAadhar = await uploadPanAndAadharToBlob(aadharCard, "aadharCard", trainer);

        res
            .status(200)
            .json({
                message: "Files uploaded successfully",
                pancard: resultPan.url,
                aadharCard: resultAadhar.url
            });
    } catch (error) {
        res
            .status(500)
            .json({ error: error.message });
    }
});

export default router;