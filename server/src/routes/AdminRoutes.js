import express from 'express';
import { addEmployee, getEmployeeById, getAllEmployees, updateEmployeeRole, getAllTrainers, getEmployee } from '../controllers/AdminController.js';
import { login, signOut, updatePassword } from '../controllers/AuthController.js';
import authorizeRole from '../middleware/roleMiddleware.js';
import { authEmployeeMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/", authEmployeeMiddleware, authorizeRole(["ADMIN"]), (req, res) => {
    res.status(200).send("HIii")
})

// Auth Based Routes
router.post("/login", login)
router.post("/register", addEmployee)
router.put("/updatePassword/:empId", authEmployeeMiddleware, updatePassword)

router.get("/signout", authEmployeeMiddleware, signOut)
router.get("/getAll", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), getAllEmployees)

// Get Single Emp
router.get("/getemployee", authEmployeeMiddleware, authorizeRole(["ADMIN"]), getEmployeeById)
router.get("/getemployee/:empId", authEmployeeMiddleware, authorizeRole(["ADMIN"]), getEmployee)




// Role Updating Routes
router.put("/update-role/:empId", authEmployeeMiddleware, authorizeRole(["ADMIN"]), updateEmployeeRole)
router.get("/get-all-trainers", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts", "Trainer Sourcer"]), getAllTrainers)

// Company and Deal
// router.post("/create-company", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), createCompany)
// router.get("/company/:companyId", authEmployeeMiddleware, getCompanyDetails)
// router.get("/company", authEmployeeMiddleware, getAllCompanyNamesAndIds)



export default router