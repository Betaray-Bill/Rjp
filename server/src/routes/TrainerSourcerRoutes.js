import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import authorizeRole from '../middleware/roleMiddleware.js';
import { registerTrainer } from '../controllers/TrainerSourcerController.js';
import { signOut } from '../controllers/AuthController.js';
// import multer from 'multer';
// const upload = multer({ dest: "uploads/" });

const router = express.Router();


router.get("/", authMiddleware, authorizeRole(["ADMIN", "Trainer Sourcer"]), (req, res) => {
    res.status(200).send("Inside the Trainer Sourcer")
})

router.post("/register-trainer",
    authMiddleware,
    authorizeRole(["ADMIN", "Trainer Sourcer"]),
    registerTrainer
)


// router.post("/upload", upload.single("resume"), authMiddleware, authorizeRole(["ADMIN", "Trainer Sourcer"]), uploadResumeToAzureAndExtractText)


router.get("/signout", authMiddleware, signOut)


export default router