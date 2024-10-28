import express from 'express';
import { authEmployeeMiddleware, authMiddleware } from '../middleware/authMiddleware.js';
import { signOut } from '../controllers/AuthController.js';
import { acceptNDA, addTrainingDates, getAllTrainer, getTrainerById, resumeCopy, trainerLogin, updateTrainerProfile } from '../controllers/TrainerController.js';
import authorizeRole from '../middleware/roleMiddleware.js';
import { searchTrainer } from '../controllers/SearchController.js';
import { changepassword } from '../controllers/TrainerController.js';
import { updateResume } from '../controllers/TrainerSourcerController.js';

const router = express.Router();


router.post("/login", trainerLogin)
router.post("/accept-nda", authMiddleware, acceptNDA)
router.post("/reject-nda", authMiddleware, signOut)
router.put("/update-profile/:id", authMiddleware, updateTrainerProfile)
router.put("/change-password/:id", authMiddleware, changepassword)
router.get("/search", authEmployeeMiddleware, authorizeRole(['ADMIN', 'KeyAccounts', 'MANAGER']), searchTrainer)
router.post('/trainingDates/:id', authMiddleware, addTrainingDates)
router.get("/details/:id", authEmployeeMiddleware, getTrainerById)
router.get("/getAll", authMiddleware, authorizeRole(['ADMIN', 'KeyAccounts', 'MANAGER']), getAllTrainer)
router.post("/:id/copy-resume", authMiddleware, resumeCopy)
router.get("/signout", authMiddleware, signOut)
router.put("/updateResume/:trainer_id/resume/:resume_id", authMiddleware, updateResume)

// get

// Get Trainers as Emp they were Registered
router.get("/getTrainers", authEmployeeMiddleware, authorizeRole(['ADMIN', 'KeyAccounts', 'MANAGER']), getAllTrainer)

export default router