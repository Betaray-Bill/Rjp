import express from 'express';
import { addEmployee, getEmployeeById, getAllEmployees, updateEmployeeRole, getAllTrainers, getEmployee } from '../controllers/AdminController.js';
import { login, signOut, updatePassword } from '../controllers/AuthController.js';
import authorizeRole from '../middleware/roleMiddleware.js';
import { authEmployeeMiddleware } from '../middleware/authMiddleware.js';
import { getRevenueByEmployees } from '../controllers/ReportController.js';
const router = express.Router();


// Revenue Reports
router.get("/get-revenue/:employeeId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), getRevenueByEmployees)






export default router