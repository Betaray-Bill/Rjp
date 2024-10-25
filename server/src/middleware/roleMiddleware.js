import Employee from "../models/EmployeeModel.js"

const authorizeRole = (...allowedRoles) => {
    return async(req, res, next) => {
        console.log("REQ", req.user)
        try {
            const employee = await Employee.findById(req.user._id)
            console.log("Emp : " + employee)
            if (!employee) {
                return res.status(404).json({ message: "Employee not found" })
            }
            // Get Allowed Roles List
            let roles = []
            for (let role of allowedRoles) {
                for (let item in role) {
                    roles.push(role[item])
                }
            }

            // Check if User has the required role
            roles.forEach(role => {
                for (let i = 0; i < req.user.role.length; i++) {
                    if (req.user.role[i].name === role) {
                        console.log("Same ", req.user.role[i].name, " as ", role)
                        next()
                        break
                    }
                }

            })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Server Error" })
        }
    }
}

export default authorizeRole;