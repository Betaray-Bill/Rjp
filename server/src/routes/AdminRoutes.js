import express from 'express';
import { addEmployee, createCompany, getAllCompanyNamesAndIds, getAllEmployees, getCompanyDetails, updateEmployeeRole } from '../controllers/AdminController.js';
import { login, signOut } from '../controllers/AuthController.js';
import authorizeRole from '../middleware/roleMiddleware.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/", authMiddleware, authorizeRole(["ADMIN"]), (req, res) => {
    res.status(200).send("HIii")
})

// Auth Based Routes
router.post("/login", login)
router.post("/register", authMiddleware, addEmployee)
router.get("/signout", authMiddleware, signOut)
router.get("/getAll", authMiddleware, authorizeRole(["ADMIN"]), getAllEmployees)

// Role Updating Routes
router.put("/update-role/:empId", authMiddleware, authorizeRole(["ADMIN"]), updateEmployeeRole)

// Company and Deal
router.post("/create-company", authMiddleware, authorizeRole(["ADMIN", "MANAGER"]), createCompany)
router.get("/company/:companyId", authMiddleware, getCompanyDetails)
router.get("/company", authMiddleware, getAllCompanyNamesAndIds)



export default router