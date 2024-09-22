import express from 'express';
import { addEmployee } from '../controllers/AdminController.js';
import { login, signOut } from '../controllers/AuthController.js';
import authorizeRole from '../middleware/roleMiddleware.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/", authMiddleware, authorizeRole("ADMIN"), (req, res) => {
    res.status(200).send("HIii")
})

router.post("/login", login) // Login for an Employee
router.post("/register", authMiddleware, authorizeRole("ADMIN"), addEmployee) // Register an Employee
router.get("/signout", authMiddleware, signOut)

// Check if a user has the permission to access any deal/

// FInal changes
// For User with many permissions - create new Middleware

export default router