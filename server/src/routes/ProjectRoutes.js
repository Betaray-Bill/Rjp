import express from 'express';
import { addEmployee, getEmployeeById, getAllEmployees, updateEmployeeRole, getAllTrainers } from '../controllers/AdminController.js';
import { login, signOut } from '../controllers/AuthController.js';
import authorizeRole from '../middleware/roleMiddleware.js';
import { authEmployeeMiddleware, authMiddleware } from '../middleware/authMiddleware.js';
import { addChatToProject, addResumeToProject, addTrainer, checkListUpdate, createProject, deleteTrainer, getAllNotes, getProject, getProjectDetails, getProjectForTrainer, getProjectsByEmp, isClientCallDone, updateStage, uploadPOUrl_Trainer } from '../controllers/ProjectController.js';
import { uploadPOToBlob } from '../controllers/AzureUploadController.js';

const router = express.Router();

router.get("/get-project/:projectId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts", "Finance"]), getProjectDetails)
router.post("/create/:empId", authEmployeeMiddleware, authorizeRole(['ADMIN', 'KeyAccounts']), createProject)
    // router.get("/projects-employees/:empId", authEmployeeMiddleware, authorizeRole(['ADMIN', 'KeyAccounts']), getProjectsByEmp)
router.get("/projects-employees/:empId", authEmployeeMiddleware, authorizeRole(['ADMIN', 'KeyAccounts', 'Finance']), getProject)

router.put("/add-trainers/:projectId", authEmployeeMiddleware, authorizeRole(["ADMIN", 'KeyAccounts']), addTrainer)
router.put("/delete-trainers/:projectId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), deleteTrainer)
router.put("/add-resume/:projectId/trainer/:trainerId/resume", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), addResumeToProject)
router.put("/updateStage/:projectId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), updateStage)
router.post("/addChat/:projectId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), addChatToProject)
router.get("/getChat/:projectId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), getAllNotes)

router.put("/updateCheckList/:projectId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), checkListUpdate)
router.put("/updateClientCall/:projectId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), isClientCallDone)
router.put("/purchaseOrder/:projectId/trainer/:trainerId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), uploadPOUrl_Trainer)


router.get("/:projectId/trainer/:trainerId", authMiddleware, getProjectForTrainer)

export default router