import express from 'express';
import { addEmployee, getEmployeeById, getAllEmployees, updateEmployeeRole, getAllTrainers, getEmployee, getAllKeysAccounts, getAllTrainerSourcer, disableEmployeeRole } from '../controllers/AdminController.js';
import { login, signOut, updatePassword } from '../controllers/AuthController.js';
import authorizeRole from '../middleware/roleMiddleware.js';
import { authEmployeeMiddleware } from '../middleware/authMiddleware.js';
import checkRoleStatus from '../middleware/checkRoleStatus.js';

const router = express.Router();

router.get("/", authEmployeeMiddleware, authorizeRole(["ADMIN"]), (req, res) => {
    res.status(200).send("HIii")
})

// Auth Based Routes
router.post("/login", login)
router.post("/register", addEmployee)
router.put("/updatePassword/:empId", authEmployeeMiddleware, updatePassword)

router.get("/signout", authEmployeeMiddleware, signOut)
router.get("/getAll", authEmployeeMiddleware, authorizeRole(["ADMIN"]),checkRoleStatus(["ADMIN"]) , getAllEmployees)

// Get Single Emp
router.get("/getemployee", authEmployeeMiddleware, authorizeRole(["ADMIN"]),checkRoleStatus(["ADMIN"]), getEmployeeById)
router.get("/getemployee/:empId", authEmployeeMiddleware, authorizeRole(["ADMIN"]),checkRoleStatus(["ADMIN"]), getEmployee)
router.get("/getkeyAccounts", authEmployeeMiddleware, authorizeRole(["ADMIN"]),checkRoleStatus(["ADMIN"]), getAllKeysAccounts)
router.get("/gettrainerSourcer", authEmployeeMiddleware, authorizeRole(["ADMIN"]), checkRoleStatus(["ADMIN"]),getAllTrainerSourcer)



// Role Updating Routes
router.put("/update-role/:empId", authEmployeeMiddleware, authorizeRole(["ADMIN"]),checkRoleStatus(["ADMIN"]), updateEmployeeRole)
router.put("/disable-role/:empId", authEmployeeMiddleware, authorizeRole(["ADMIN"]),checkRoleStatus(["ADMIN"]), disableEmployeeRole)

router.get("/get-all-trainers", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts", "TrainerSourcer"]),checkRoleStatus(["ADMIN", "KeyAccounts", "Trainer Sourcer"]), getAllTrainers)

// Company and Deal
// router.post("/create-company", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), createCompany)
// router.get("/company/:companyId", authEmployeeMiddleware, getCompanyDetails)
// router.get("/company", authEmployeeMiddleware, getAllCompanyNamesAndIds)



export default router