import express from 'express';
import { authEmployeeMiddleware, authMiddleware } from '../middleware/authMiddleware.js';
import { createCompany, createContact, getAllCompanyNamesAndIds, getCompanyDetails } from '../controllers/CompanyController.js';
import authorizeRole from '../middleware/roleMiddleware.js';


const router = express.Router();


// Company 
router.post("/create-company", authEmployeeMiddleware, authorizeRole(["ADMIN", "MANAGER"]), createCompany)
router.get("/company/:companyId", authEmployeeMiddleware, authorizeRole(["ADMIN", "MANAGER"]), getCompanyDetails)
router.get("/company", authEmployeeMiddleware, getAllCompanyNamesAndIds)
router.put("/create-contact/:companyId", authEmployeeMiddleware, authorizeRole(["ADMIN", "MANAGER"]), createContact)


export default router