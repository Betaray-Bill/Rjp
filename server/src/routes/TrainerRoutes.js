import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { signOut } from '../controllers/AuthController.js';
import { acceptNDA, trainerLogin, updateTrainerProfile } from '../controllers/TrainerController.js';
import authorizeRole from '../middleware/roleMiddleware.js';
import { searchTrainer } from '../controllers/SearchController.js';

const router = express.Router();


router.post("/login", trainerLogin)
router.post("/accept-nda", authMiddleware, acceptNDA)
router.post("/reject-nda", authMiddleware, signOut)
router.put("/update-profile/:id", authMiddleware, updateTrainerProfile)
router.get("/search", authMiddleware, authorizeRole(['ADMIN', 'KeyAccounts', 'MANAGER']), searchTrainer)

router.get("/signout", authMiddleware, signOut)


export default router