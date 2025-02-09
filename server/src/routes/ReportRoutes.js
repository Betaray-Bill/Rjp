import express from 'express';
import {
    addEmployee,
    getEmployeeById,
    getAllEmployees,
    updateEmployeeRole,
    getAllTrainers,
    getEmployee
} from '../controllers/AdminController.js';
import { login, signOut, updatePassword } from '../controllers/AuthController.js';
import authorizeRole from '../middleware/roleMiddleware.js';
import { authEmployeeMiddleware, authMiddleware } from '../middleware/authMiddleware.js';
import {
    Forecast,
    getRevenueByClients,
    getRevenueByEmployees,
    getTrainerDates,
    getTrainingDetailsByKAM,
    paymentDuePayable,
    paymentDueReceivable,
    pendingPayment,
    pendingPO,
    searchTrainer,
    trainerOccupancy,
    trainerPaymentDue,
    TrainerpendingPO,
    trainerRevenueReport,
    trainersDeployed,
    trainersSourced,
    trainingCalendar
} from '../controllers/ReportController.js';
const router = express.Router();

// Revenue Reports
router.get("/get-revenue/:employeeId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), getRevenueByEmployees)
router.get("/get-revenue/company/:company", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), getRevenueByClients)
router.get("/forecast", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), Forecast)
router.get("/calendar-view/:employeeId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), trainingCalendar)

router.get("/get-general-reports/:employeeId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), getTrainingDetailsByKAM)
router.get("/payment-due/payable/:employeeId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), paymentDuePayable)
router.get("/payment-due/receivable/:employeeId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), paymentDueReceivable)

//trainer pending
router.get("/pending/po", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts", "Finance"]), pendingPO)
router.get("/pending/payment", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts", "Finance"]), pendingPayment)

// Search Trainer
router.get("/search", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts", "TrainerSourcer"]), searchTrainer)
router.get("/trainer/:trainerId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts", "TrainerSourcer"]), getTrainerDates)
router.get('/trainer/get-revenue/:trainerId', trainerRevenueReport)

// Trainer SOurcer
router.get("/trainer-sourcer/sourced/:employeeId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts", "TrainerSourcer"]), trainersSourced)
router.get("/trainer-sourcer/deployed/:employeeId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts", "TrainerSourcer"]), trainersDeployed)


//Trainer Website Reports Controller
router.get("/trainer/pending/po/:trainerId", authMiddleware,  TrainerpendingPO)
router.get("/trainer/pending/payment/:trainerId", authMiddleware,  trainerPaymentDue)
router.get("/trainer/occupancy/:trainerId", authMiddleware,  trainerOccupancy)



export default router