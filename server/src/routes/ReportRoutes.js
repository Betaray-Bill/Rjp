import express from 'express';
import { addEmployee, getEmployeeById, getAllEmployees, updateEmployeeRole, getAllTrainers, getEmployee } from '../controllers/AdminController.js';
import { login, signOut, updatePassword } from '../controllers/AuthController.js';
import authorizeRole from '../middleware/roleMiddleware.js';
import { authEmployeeMiddleware } from '../middleware/authMiddleware.js';
import { getRevenueByClients, getRevenueByEmployees, getTrainerDates, getTrainingDetailsByKAM, pendingPayment, pendingPO, searchTrainer, trainersSourced, trainingCalendar } from '../controllers/ReportController.js';
const router = express.Router();


// Revenue Reports
router.get("/get-revenue/:employeeId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), getRevenueByEmployees)
router.get("/get-revenue/company/:company", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), getRevenueByClients)
router.get("/calendar-view/:employeeId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), trainingCalendar)

router.get("/get-general-reports/:employeeId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), getTrainingDetailsByKAM)



// 
router.get("/pending/po", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts", "Finance"]), pendingPO)
router.get("/pending/payment", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts", "Finance"]), pendingPayment)


// Search Trainer
router.get("/search", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), searchTrainer)
router.get("/trainer/:trainerId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), getTrainerDates)


// Trainer SOurcer
router.get("/trainer-sourcer/sourced/:employeeId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), trainersSourced)
router.get("/trainer-sourcer/deployed/:employeeId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), trainersSourced)







export default router