import express from 'express';
import { addEmployee, getEmployeeById, getAllEmployees, updateEmployeeRole, getAllTrainers } from '../controllers/AdminController.js';
import { login, signOut } from '../controllers/AuthController.js';
import authorizeRole from '../middleware/roleMiddleware.js';
import { authEmployeeMiddleware } from '../middleware/authMiddleware.js';
import { createProject, getProjectDetails } from '../controllers/ProjectController.js';

const router = express.Router();

router.get("/get-project/:projectId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), getProjectDetails)
router.post("/create/:empId", authEmployeeMiddleware, authorizeRole(['ADMIN', 'KeyAccounts']), createProject)




export default router