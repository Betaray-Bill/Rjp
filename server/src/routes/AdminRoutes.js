import express from 'express';
import { addEmployee, createRole } from '../controllers/AdminController.js';
import { login } from '../controllers/AuthController.js';
import authorizeRole from '../middleware/roleMiddleware.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/", authMiddleware, authorizeRole("ADMIN"), (req, res) => {

    res.status(200).send("HIii")
})
router.post("/login", login) // Login for an Employee
router.post("/register", addEmployee) // Register an Employee
router.post('/create-role', createRole) // Create a Role

export default router