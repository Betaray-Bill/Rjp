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
    let pancard, aadharCard;
    console.log(files)

    if (files.pancard && files.pancard[0].fieldname) {
        pancard = files.pancard[0]
    }

    if (files.aadharCard && files.aadharCard[0].fieldname) {
        aadharCard = files.aadharCard[0]
    }

    console.log("pancard file:", pancard); // Details of uploaded pancard
    console.log("AadharCard file:", aadharCard); // Details of uploaded aadhar card

    if (!req.files) {
        return res
            .status(400)
            .json({ error: "No file uploaded." });
    }

    try {
        let resultPan, resultAadhar;
        console.log(1)
        if (files.pancard && files.pancard[0].fieldname && files.pancard[0]) {
            resultPan = await uploadPanAndAadharToBlob(pancard, "pancard", trainer);
        }
        console.log(2)

        if (files.aadharCard && files.aadharCard[0].fieldname &&  files.aadharCard[0].fieldname) {
            resultAadhar = await uploadPanAndAadharToBlob(aadharCard, "aadharCard", trainer);
        }
        console.log(3)
        // const resultPan = await uploadPanAndAadharToBlob(pancard, "pancard", trainer);
        // const resultAadhar = await uploadPanAndAadharToBlob(aadharCard, "aadharCard", trainer);
        let result = {};
        if (resultPan !== undefined) {
            // resultPan = await uploadPanAndAadharToBlob(pancard, "pancard", trainer);/
            result.panCard = resultPan.url
            
        }
        console.log(2, result)

        if (resultAadhar !== undefined) {
            result.aadharCard =  resultAadhar.url
            console.log("inside adhar", result)
            // resultAadhar = await uploadPanAndAadharToBlob(aadharCard, "aadharCard", trainer);
        }
        console.log(4)
        res
            .status(200)
            .json({
                message: "Files uploaded successfully",
                ...result
                // panCard: resultPan ? resultPan.url : null,
                // aadharCard: resultAadhar ? resultAadhar.url : null
            });
    } catch (error) {
        console.log("error")
        res
            .status(500)
            .json({ error: error.message });
    }
});

export default router;