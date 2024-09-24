import express from 'express';
import { addEmployee, createCompany, getAllCompanyNamesAndIds, getCompanyDetails } from '../controllers/AdminController.js';
import { login, signOut } from '../controllers/AuthController.js';
import authorizeRole from '../middleware/roleMiddleware.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/", authMiddleware, authorizeRole("ADMIN"), (req, res) => {
    res.status(200).send("HIii")
})

// Auth Based Routes
router.post("/login", login)
router.post("/register", authMiddleware, authorizeRole(["ADMIN"]), addEmployee)
router.get("/signout", authMiddleware, signOut)

// Company and Deal
router.post("/create-company", authMiddleware, authorizeRole(["ADMIN", "MANAGER"]), createCompany)
router.get("/company/:companyId", authMiddleware, getCompanyDetails)
router.get("/company/getAllCompany", authMiddleware, authorizeRole(["ADMIN", "MANAGER"]), getAllCompanyNamesAndIds)



// Check if a user has the permission to access any deal/

// FInal changes
// For User with many permissions - create new Middleware

export default router