import express from 'express';
import { addEmployee, getEmployeeById, getAllEmployees, updateEmployeeRole, getAllTrainers } from '../controllers/AdminController.js';
import { login, signOut } from '../controllers/AuthController.js';
import authorizeRole from '../middleware/roleMiddleware.js';
import { authEmployeeMiddleware, authMiddleware } from '../middleware/authMiddleware.js';
import { acceptOrDecline, addChatToProject, addExpenses, addRemainders, addResumeToProject, addTrainer, checkListUpdate, client_amount_dueDate, client_invoice_sent, createProject, deleteTrainer, getAllNotes, getExpenses, getOngoingProjects, getProject, getProjectDetails, getProjectForTrainer, getProjectsByEmp, getRemainders, isClientCallDone, isFinalizedController, savePurchaseOrder, updateInvoice_by_paid, updateLost_Won, updateStage, updateTraining, updateTrainingDatesForTrainer, upload_Invoice_Url_Trainer, uploadPOUrl_Trainer } from '../controllers/ProjectController.js';
import { uploadPOToBlob } from '../controllers/AzureUploadController.js';
import checkRoleStatus from '../middleware/checkRoleStatus.js';

const router = express.Router();

router.get("/get-project/:projectId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts", "Finance"]), getProjectDetails)
router.post("/create/:empId", authEmployeeMiddleware, authorizeRole(['ADMIN', 'KeyAccounts']), createProject)
    // router.get("/projects-employees/:empId", authEmployeeMiddleware, authorizeRole(['ADMIN', 'KeyAccounts']), getProjectsByEmp)
router.get("/projects-employees/:empId", authEmployeeMiddleware, authorizeRole(['ADMIN', 'KeyAccounts', 'Finance', ]), getProject)

router.put("/add-trainers/:projectId", authEmployeeMiddleware, authorizeRole(["ADMIN", 'KeyAccounts']), checkRoleStatus(['ADMIN', "KeyAccounts"]), addTrainer)
router.put("/delete-trainers/:projectId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), checkRoleStatus(['ADMIN', "KeyAccounts"]), deleteTrainer)
router.put("/add-resume/:projectId/trainer/:trainerId/resume", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), checkRoleStatus(['ADMIN', "KeyAccounts"]), addResumeToProject)
router.put("/updateStage/:projectId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), checkRoleStatus(['ADMIN', "KeyAccounts"]), updateStage)
router.put("/updateTraining/:projectId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), checkRoleStatus(['ADMIN', "KeyAccounts"]), updateTraining)

//Controller for updating the training date of the trainer
router.post("/trainer/dates/:projectId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), checkRoleStatus(['ADMIN', "KeyAccounts"]), updateTrainingDatesForTrainer)


router.post("/addChat/:projectId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), checkRoleStatus(['ADMIN', "KeyAccounts"]), addChatToProject)
router.get("/getChat/:projectId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), getAllNotes)

router.put("/updateCheckList/:projectId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), checkRoleStatus(['ADMIN', "KeyAccounts"]), checkListUpdate)
router.put("/updateClientCall/:projectId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), checkRoleStatus(['ADMIN', "KeyAccounts"]), isClientCallDone)
router.put("/isFinalized/:projectId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), checkRoleStatus(['ADMIN', "KeyAccounts"]), isFinalizedController)
router.put("/purchaseOrder/:projectId/trainer/:trainerId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), checkRoleStatus(['ADMIN', "KeyAccounts"]), uploadPOUrl_Trainer)
router.put("/save-purchaseOrder/:projectId/trainer/:trainerId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts", "Finance"]), checkRoleStatus(['ADMIN', "KeyAccounts", "Finance"]), savePurchaseOrder)
router.put("/accept-decline/:projectId/trainer/:trainerId", authMiddleware, acceptOrDecline)

router.put('/updateInvoice/project/:projectId/trainer/:trainerId', authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), updateInvoice_by_paid)

// Invoice Sent - Client
router.put('/update-client-invoice/project/:projectId', authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), checkRoleStatus(['ADMIN', "KeyAccounts"]), client_invoice_sent)
router.put('/update-client-amount/project/:projectId', authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), checkRoleStatus(['ADMIN', "KeyAccounts"]), client_amount_dueDate)

// remainders
router.put('/remainder/:projectId', authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), checkRoleStatus(['ADMIN', "KeyAccounts"]), addRemainders)
router.get('/remainders/:empId', authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), getRemainders)


router.put('/expense/:projectId', authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts", "Finance"]), checkRoleStatus(['ADMIN', "KeyAccounts", "Finance"]), addExpenses)
router.get('/expense/:projectId', authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts", "Finance"]), getExpenses)

// router.put("/purchaseOrder/:prsojectId/trainer/:trainerId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), upload_Invoice_Url_Trainer)

// upload_Invoice_Url_Trainer

// Lost/Won stage update
router.put("/updateLostWon/:projectId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), checkRoleStatus(['ADMIN', "KeyAccounts"]), updateLost_Won)

router.get("/:projectId/trainer/:trainerId", authMiddleware, getProjectForTrainer)

router.get("/ongoing/:employeeId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), getOngoingProjects)


export default router