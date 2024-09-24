import Employee from "../models/EmployeeModel.js"

const authorizeRole = (...allowedRoles) => {
    return async(req, res, next) => {
        console.log(req.user)
        try {
            const employee = await Employee.findById(req.user._id)
            console.log("Emo=p : " + employee)
            console.log(allowedRoles)
            let roles = []
            for (let role of allowedRoles) {
                for (let item in role) {
                    roles.push(role[item])
                }
            }
            console.log(roles)
            roles.forEach(role => {
                    console.log(role + " " + req.user.role.name)
                    if (req.user.role.name === role) {
                        console.log("Same")
                        next()
                    }
                })
                // if (!allowedRoles.includes(req.user.role.name)) {
                // return res.status(403).json({
                //         message: "Unauthorized Access"
                //     })
                // }
                // next()
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Server Error" })
        }
    }
}

export default authorizeRole;