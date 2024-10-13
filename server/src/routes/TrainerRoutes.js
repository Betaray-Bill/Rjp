import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { signOut } from '../controllers/AuthController.js';
import { acceptNDA, addTrainingDates, getAllTrainer, getTrainerById, resumeCopy, trainerLogin, updateTrainerProfile } from '../controllers/TrainerController.js';
import authorizeRole from '../middleware/roleMiddleware.js';
import { searchTrainer } from '../controllers/SearchController.js';
import { updateResume } from '../controllers/TrainerSourcerController.js';

const router = express.Router();


router.post("/login", trainerLogin)
router.post("/accept-nda", authMiddleware, acceptNDA)
router.post("/reject-nda", authMiddleware, signOut)
router.put("/update-profile/:id", authMiddleware, updateTrainerProfile)
router.get("/search", authMiddleware, authorizeRole(['ADMIN', 'KeyAccounts', 'MANAGER']), searchTrainer)
router.post('/trainingDates/:id', authMiddleware, addTrainingDates)
router.get("/details/:id", authMiddleware, getTrainerById)
router.get("/getAll", authMiddleware, authorizeRole(['ADMIN', 'KeyAccounts', 'MANAGER']), getAllTrainer)
router.post("/:id/copy-resume", authMiddleware, resumeCopy)
router.get("/signout", authMiddleware, signOut)
router.put("/updateresume/:id", authMiddleware,updateResume )

export default router