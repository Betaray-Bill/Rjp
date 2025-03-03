import express from 'express';
import { authEmployeeMiddleware, authMiddleware } from '../middleware/authMiddleware.js';

import { acceptNDA, addMainResume, addTrainingDates, addWorkingDates, deleteWorkingDate, getAllTrainer, getResumeById, getTrainerById, resetPassword, resumeCopy, signOut, trainerLogin, updateResumeFromMainResume, updateTrainerProfile, updateWorkingDates } from '../controllers/TrainerController.js';
import authorizeRole from '../middleware/roleMiddleware.js';
import { searchTrainer } from '../controllers/SearchController.js';
import { changepassword } from '../controllers/TrainerController.js';
import { updateResume } from '../controllers/TrainerSourcerController.js';
import { upload_Invoice_Content_Trainer, upload_Invoice_Url_Trainer } from '../controllers/ProjectController.js';
import checkRoleStatus from '../middleware/checkRoleStatus.js';

const router = express.Router();


router.post("/login", trainerLogin)
router.post("/accept-nda", authMiddleware, acceptNDA)
router.post("/reject-nda", authMiddleware, signOut)
router.put("/update/:id", authMiddleware, updateTrainerProfile)

router.put("/change-password/:id", authMiddleware, changepassword)
router.put("/reset/:id", authEmployeeMiddleware, authorizeRole(['ADMIN', 'TrainerSourcer']),checkRoleStatus(['ADMIN',  "TrainerSourcer" ]) ,resetPassword)
router.get("/search/:empId", authEmployeeMiddleware, authorizeRole(['ADMIN', 'KeyAccounts', 'TrainerSourcer']), searchTrainer)
router.post('/trainingDates/:id', authMiddleware, addTrainingDates)
router.get("/details/:id", authMiddleware, getTrainerById)
router.get("/details/emp/:id", authEmployeeMiddleware, getTrainerById)
router.get("/getAll", authMiddleware, authorizeRole(['ADMIN', 'KeyAccounts']), getAllTrainer)
router.post("/:id/copy-resume", authMiddleware, resumeCopy)
router.get("/resume/:id", authMiddleware, getResumeById)
router.post("/main-resume/:id", authMiddleware, addMainResume)
router.get("/signout", authMiddleware, signOut)
router.put("/updateResume/:trainer_id/resume/:resume_id", authMiddleware, updateResume)
router.put("/updateResumeFromMain/:trainerId/main/:mainResumeId/resume/:resumeId", authMiddleware, updateResumeFromMainResume)

router.put('/uploadInvoice/project/:projectId/trainer/:trainerId', authMiddleware, upload_Invoice_Url_Trainer)
router.put('/sendInvoice/project/:projectId/trainer/:trainerId', authMiddleware, upload_Invoice_Content_Trainer)
router.put('/workingDates/:trainerId', authMiddleware, addWorkingDates)
router.put('/workingDates/update/:trainerId', authMiddleware, updateWorkingDates)
router.delete('/workingDates/:trainerId', authMiddleware, deleteWorkingDate)


// addWorkingDates
// upload_Invoice_Content_Trainer
// get

// Get Trainers as Emp they were Registered
router.get("/getTrainers", authEmployeeMiddleware, authorizeRole(['ADMIN', 'KeyAccounts']), getAllTrainer)

export default router