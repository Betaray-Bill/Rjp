// routes/azureBlobRoutes.js
import express from "express";
import multer from "multer";
import { uploadFileToBlob, checkBlobConnection } from "../controllers/AzureUploadController.js";

const router = express.Router();
const upload = multer(); // Use multer with buffer storage


router.get("/check-blob-connection", checkBlobConnection);

// Endpoint to handle file upload with folder name
router.post("/upload-to-blob", upload.single("file"), async(req, res) => {
    const { folderName } = req.body;

    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
    }

    try {
        const result = await uploadFileToBlob(req.file, folderName);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;