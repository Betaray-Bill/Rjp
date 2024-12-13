import express from 'express';
import { addEmployee, getEmployeeById, getAllEmployees, updateEmployeeRole, getAllTrainers } from '../controllers/AdminController.js';
import { login, signOut } from '../controllers/AuthController.js';
import authorizeRole from '../middleware/roleMiddleware.js';
import { authEmployeeMiddleware, authMiddleware } from '../middleware/authMiddleware.js';
import { acceptOrDecline, addChatToProject, addRemainders, addResumeToProject, addTrainer, checkListUpdate, createProject, deleteTrainer, getAllNotes, getProject, getProjectDetails, getProjectForTrainer, getProjectsByEmp, isClientCallDone, savePurchaseOrder, updateInvoice_by_paid, updateStage, updateTraining, upload_Invoice_Url_Trainer, uploadPOUrl_Trainer } from '../controllers/ProjectController.js';
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
router.put("/updateTraining/:projectId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), updateTraining)

router.post("/addChat/:projectId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), addChatToProject)
router.get("/getChat/:projectId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), getAllNotes)

router.put("/updateCheckList/:projectId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), checkListUpdate)
router.put("/updateClientCall/:projectId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), isClientCallDone)
router.put("/purchaseOrder/:projectId/trainer/:trainerId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), uploadPOUrl_Trainer)
router.put("/save-purchaseOrder/:projectId/trainer/:trainerId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts", "Finance"]), savePurchaseOrder)
router.put("/accept-decline/:projectId/trainer/:trainerId", authMiddleware, acceptOrDecline)

router.put('/updateInvoice/project/:projectId/trainer/:trainerId', authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), updateInvoice_by_paid)

// remainders
router.put('/remainder/:projectId', authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), addRemainders)

// router.put("/purchaseOrder/:prsojectId/trainer/:trainerId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), upload_Invoice_Url_Trainer)

// upload_Invoice_Url_Trainer

router.get("/:projectId/trainer/:trainerId", authMiddleware, getProjectForTrainer)

export default router