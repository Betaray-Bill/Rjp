import Employee from "../models/EmployeeModel.js"

const authorizeRole = (...allowedRoles) => {
    return async(req, res, next) => {
        console.log(req.user)
        const employee = await Employee.findById(req.user._id)
        console.log("Emo=p : " + employee)
        if (!allowedRoles.includes(req.user.role.name)) {
            return res.status(403).json({
                message: "Unauthorized Access"
            })
        }
        next()
    }
}

export default authorizeRole;