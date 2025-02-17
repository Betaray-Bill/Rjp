import express from 'express';
import { authEmployeeMiddleware, authMiddleware } from '../middleware/authMiddleware.js';
import { createCompany, createContact, deleteContactDetails, editContactDetails, getAllCompanyNamesAndIds, getCompanyAndId, getCompanyDetails } from '../controllers/CompanyController.js';
import authorizeRole from '../middleware/roleMiddleware.js';


const router = express.Router();


// Company 
router.post("/create-company", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), createCompany)
router.get("/company/:companyId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), getCompanyDetails)
router.get("/getAll-company", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), getCompanyAndId)
router.get("/company", authEmployeeMiddleware, getAllCompanyNamesAndIds)
router.put("/create-contact/:companyId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), createContact)
router.put("/edit-contact/:companyId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), editContactDetails)
router.delete("/delete-contact/:companyId/:contactId", authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]), deleteContactDetails)




export default router