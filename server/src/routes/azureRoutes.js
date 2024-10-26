// routes/azureRoutes.js
import express from "express";
import multer from "multer";
import { checkAzureConnection, processDocument } from "../controllers/AzureController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Use memory storage to avoid saving locally

router.get("/check-connection", checkAzureConnection);

router.post("/upload", upload.single("resume"), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ error: "No file uploaded." });
  }
  processDocument(req.file, res); // Pass the in-memory file buffer to the controller
});

export default router;
