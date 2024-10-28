import express from 'express';
import { authEmployeeMiddleware } from '../middleware/authMiddleware.js';
import authorizeRole from '../middleware/roleMiddleware.js';
import { registerTrainer, updateResume } from '../controllers/TrainerSourcerController.js';
import { signOut } from '../controllers/AuthController.js';
import { resumeCopy } from '../controllers/TrainerController.js';
// import multer from 'multer';
// const upload = multer({ dest: "uploads/" });

const router = express.Router();


router.get("/", authEmployeeMiddleware, authorizeRole(["ADMIN", "Trainer Sourcer"]), (req, res) => {
    res.status(200).send("Inside the Trainer Sourcer")
})

router.post("/register-trainer/:trainerId",
    authEmployeeMiddleware,
    authorizeRole(["ADMIN", "Trainer Sourcer"]),
    registerTrainer
)


// router.post("/upload", upload.single("resume"), authMiddleware, authorizeRole(["ADMIN", "Trainer Sourcer"]), uploadResumeToAzureAndExtractText)


router.get("/signout", authEmployeeMiddleware, signOut)

// Handling Trainer Data
router.put("/updateResume/:trainer_id/resume/:resume_id", authEmployeeMiddleware, updateResume)



export default router