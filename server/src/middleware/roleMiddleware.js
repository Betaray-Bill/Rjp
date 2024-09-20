import { Role } from "../models/EmployeeModel.js"

const authorizeRole = (...allowedRoles) => {
    console.log("Allowed : ", allowedRoles)
    return async(req, res, next) => {
        const role = await Role.findById(req.user.role)
        console.log(role)
        if (!allowedRoles.includes(role.name)) {
            return res.status(403).json({
                message: "Unauthorized Access"
            })
        }
        next()
    }
}

export default authorizeRole;