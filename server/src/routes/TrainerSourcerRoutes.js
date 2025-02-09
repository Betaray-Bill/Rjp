import express from 'express';
import { authEmployeeMiddleware } from '../middleware/authMiddleware.js';
import authorizeRole from '../middleware/roleMiddleware.js';
import { addRating, addRemark, getResumeById, getTrainerByEmpId, registerTrainer, updateResume } from '../controllers/TrainerSourcerController.js';
import { signOut } from '../controllers/AuthController.js';
import { lockResume, resumeCopy, updateTrainerProfile } from '../controllers/TrainerController.js';
import checkRoleStatus from '../middleware/checkRoleStatus.js';
// import multer from 'multer';
// const upload = multer({ dest: "uploads/" });

const router = express.Router();


router.get("/", authEmployeeMiddleware, authorizeRole(["ADMIN", "TrainerSourcer"]), (req, res) => {
    res.status(200).send("Inside the TrainerSourcer")
})

router.post("/register-trainer/:trainerId",
    authEmployeeMiddleware,
    authorizeRole(["ADMIN", "TrainerSourcer"]),
    registerTrainer
)


// router.post("/upload", upload.single("resume"), authMiddleware, authorizeRole(["ADMIN", "TrainerSourcer"]), uploadResumeToAzureAndExtractText)


router.get("/signout", authEmployeeMiddleware, signOut)

// Handling Trainer Data
router.put("/updateResume/:trainer_id/resume/:resume_id", authEmployeeMiddleware, authorizeRole(["ADMIN", "TrainerSourcer", "KeyAccounts"]), checkRoleStatus(['ADMIN', "TrainerSourcer"]), updateResume)
router.put("/update-profile/:id", authEmployeeMiddleware, updateTrainerProfile)
router.post("/:id/copy-resume", authEmployeeMiddleware, resumeCopy)
router.get("/getTrainer/:emp_id", authEmployeeMiddleware, authorizeRole(["ADMIN", "TrainerSourcer"]), getTrainerByEmpId)
router.put('/updateLockStatus/:id', authEmployeeMiddleware, authorizeRole(["ADMIN", "TrainerSourcer", "KeyAccounts"]), lockResume)


router.get("/resume/:id", authEmployeeMiddleware, authorizeRole(["ADMIN", "TrainerSourcer", "KeyAccounts"]), getResumeById)
// Rating
router.put('/remarks/:trainerId', authEmployeeMiddleware, authorizeRole(["ADMIN", "TrainerSourcer", "KeyAccounts"]), addRemark)
router.put('/rating/:trainerId', authEmployeeMiddleware, authorizeRole(["ADMIN", "TrainerSourcer", "KeyAccounts"]), addRating)



export default router