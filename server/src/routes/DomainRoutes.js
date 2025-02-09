// routes/azureRoutes.js
import express from "express";  
import { initializeDomains,
    deleteSubdomain,
    editSubdomain,
    addSubdomain,
    addDomain, 
    getDomains} from "../controllers/DomainController.js";
import authorizeRole from "../middleware/roleMiddleware.js";
import { authEmployeeMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get('/',getDomains)
router.post("/initialize",  authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]),initializeDomains);
router.post("/add",  authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]),addDomain);
router.put("/add-subdomain",  authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]),addSubdomain);
router.put("/edit-subdomain",  authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]),editSubdomain);
router.delete("/delete-subdomain",  authEmployeeMiddleware, authorizeRole(["ADMIN", "KeyAccounts"]),deleteSubdomain)



export default router;
