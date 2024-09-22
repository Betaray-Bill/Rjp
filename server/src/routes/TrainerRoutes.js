import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import authorizeRole from '../middleware/roleMiddleware.js';
import { signOut } from '../controllers/AuthController.js';
import { acceptNDA, trainerLogin } from '../controllers/TrainerController.js';

const router = express.Router();


router.post("/login", trainerLogin)
router.post("/accept-nda", authMiddleware, acceptNDA)

router.get("/signout", authMiddleware, signOut)


export default router