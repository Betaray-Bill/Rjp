import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { signOut } from '../controllers/AuthController.js';
import { acceptNDA, trainerLogin, updateTrainerProfile } from '../controllers/TrainerController.js';

const router = express.Router();


router.post("/login", trainerLogin)
router.post("/accept-nda", authMiddleware, acceptNDA)
router.post("/reject-nda", authMiddleware, signOut)
router.put("/update-profile/:id", authMiddleware, updateTrainerProfile)

router.get("/signout", authMiddleware, signOut)


export default router