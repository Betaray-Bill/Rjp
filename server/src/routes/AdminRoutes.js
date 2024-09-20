import express from 'express';
import { createRole, login } from '../controllers/EmployeeController.js';
import { addEmployee } from '../controllers/AdminController.js';
// import protect from '../middleware/authMiddleware.js';
const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).send("HIii")
})
router.post("/login", login) // Login for an Employee
router.post("/register", addEmployee) // Register an Employee
router.post('/create-role', createRole) // Create a Role

export default router