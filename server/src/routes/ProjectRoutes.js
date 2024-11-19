import express from 'express';
import { addEmployee, getEmployeeById, getAllEmployees, updateEmployeeRole, getAllTrainers } from '../controllers/AdminController.js';
import { login, signOut } from '../controllers/AuthController.js';
import authorizeRole from '../middleware/roleMiddleware.js';
import { authEmployeeMiddleware } from '../middleware/authMiddleware.js';
import { addResumeToProject, addTrainer, createProject, deleteTrainer, getProject, getProjectDetails, getProjectsByEmp, updateStage } from '../controllers/ProjectController.js';

const router = express.Router();

router.get("/get-project/:projectId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), getProjectDetails)
router.post("/create/:empId", authEmployeeMiddleware, authorizeRole(['ADMIN', 'KeyAccounts']), createProject)
    // router.get("/projects-employees/:empId", authEmployeeMiddleware, authorizeRole(['ADMIN', 'KeyAccounts']), getProjectsByEmp)
router.get("/projects-employees", authEmployeeMiddleware, authorizeRole(['ADMIN', 'KeyAccounts']), getProject)

router.put("/add-trainers/:projectId", authEmployeeMiddleware, authorizeRole(["ADMIN", 'KeyAccounts']), addTrainer)
router.put("/delete-trainers/:projectId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), deleteTrainer)
router.put("/add-resume/:projectId/trainer/:trainerId/resume", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), addResumeToProject)
router.put("/updateStage/:projectId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), updateStage)

export default router