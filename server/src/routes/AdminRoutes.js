import express from 'express';
import { addEmployee, createCompany, getEmployeeById, getAllCompanyNamesAndIds, getAllEmployees, getCompanyDetails, updateEmployeeRole, getAllTrainers } from '../controllers/AdminController.js';
import { login, signOut } from '../controllers/AuthController.js';
import authorizeRole from '../middleware/roleMiddleware.js';
import { authEmployeeMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/", authEmployeeMiddleware, authorizeRole(["ADMIN"]), (req, res) => {
    res.status(200).send("HIii")
})

// Auth Based Routes
router.post("/login", login)
router.post("/register", authEmployeeMiddleware, addEmployee)
router.get("/signout", authEmployeeMiddleware, signOut)
router.get("/getAll", authEmployeeMiddleware, authorizeRole(["ADMIN"]), getAllEmployees)

// Get Single Emp
router.get("/getemployee", authEmployeeMiddleware, authorizeRole(["ADMIN"]), getEmployeeById)



// Role Updating Routes
router.put("/update-role/:empId", authEmployeeMiddleware, authorizeRole(["ADMIN"]), updateEmployeeRole)
router.get("/get-all-trainers", authEmployeeMiddleware, authorizeRole(["ADMIN", "MANAGER", "Trainer Sourcer"]), getAllTrainers)

// Company and Deal
router.post("/create-company", authEmployeeMiddleware, authorizeRole(["ADMIN", "MANAGER"]), createCompany)
router.get("/company/:companyId", authEmployeeMiddleware, getCompanyDetails)
router.get("/company", authEmployeeMiddleware, getAllCompanyNamesAndIds)



export default router