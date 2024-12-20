import express from 'express';
import { addEmployee, getEmployeeById, getAllEmployees, updateEmployeeRole, getAllTrainers, getEmployee } from '../controllers/AdminController.js';
import { login, signOut, updatePassword } from '../controllers/AuthController.js';
import authorizeRole from '../middleware/roleMiddleware.js';
import { authEmployeeMiddleware } from '../middleware/authMiddleware.js';
import { getRevenueByClients, getRevenueByEmployees, getTrainingDetailsByKAM, trainingCalendar } from '../controllers/ReportController.js';
const router = express.Router();


// Revenue Reports
router.get("/get-revenue/:employeeId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), getRevenueByEmployees)
router.get("/get-revenue/company/:company", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), getRevenueByClients)
router.get("/calendar-view/:employeeId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), trainingCalendar)

router.get("/get-general-reports/:employeeId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), getTrainingDetailsByKAM)







export default router